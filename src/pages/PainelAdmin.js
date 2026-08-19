import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

function diasAtras(dias) {
  return new Date(Date.now() - dias * 24 * 60 * 60 * 1000).toISOString();
}

export default function PainelAdmin() {
  const { perfil } = useAuth();
  const [carregando, setCarregando] = useState(true);

  const [alertas, setAlertas] = useState({
    reflexoesAtivas: 0,
    conteudosPendentes: 0,
    candidaturasPendentes: 0,
    novosUsuarios: 0,
    assinaturasRecentes: [],
    avaliacoesAtrasadas: [],
    clubeDoMesExiste: true,
    rodaFuturaExiste: true,
  });

  const [candidaturas, setCandidaturas] = useState([]);
  const [conteudosPend, setConteudosPend] = useState([]);

  const [formRoda, setFormRoda] = useState({ titulo: "", descricao: "", link_meet: "", data_hora: "" });
  const [formClube, setFormClube] = useState({ livro_titulo: "", livro_autor: "", descricao: "", link_grupo: "", data_encontro: "" });
  const [produtosLoja, setProdutosLoja] = useState([]);
  const [formLoja, setFormLoja] = useState({ titulo: "", descricao: "", categoria: "livros", link_afiliado: "", imagem_url: "", destaque: "" });
  const [solicitacoesMatch, setSolicitacoesMatch] = useState([]);
  const [buscaPerfil, setBuscaPerfil] = useState("");
  const [resultadosBusca, setResultadosBusca] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [mensagemAcao, setMensagemAcao] = useState(null);

  async function carregarTudo() {
    setCarregando(true);
    const primeiroDiaMes = new Date();
    primeiroDiaMes.setDate(1);
    primeiroDiaMes.setHours(0, 0, 0, 0);
    const primeiroDiaMesISO = `${primeiroDiaMes.getFullYear()}-${String(primeiroDiaMes.getMonth() + 1).padStart(2, "0")}-01`;

    const [
      reflexoesRes,
      conteudosPendRes,
      candidaturasRes,
      novosUsuariosRes,
      assinaturasRes,
      clubeMesRes,
      rodaFuturaRes,
      premiumRes,
      avaliacoesRes,
      produtosLojaRes,
      solicitacoesMatchRes,
    ] = await Promise.all([
      supabase.from("reflexoes_diarias").select("id", { count: "exact", head: true }).eq("ativo", true),
      supabase.from("conteudos").select("id, titulo, formato, plano_minimo, autor_id, criado_em").eq("status", "Pendente").order("criado_em", { ascending: false }),
      supabase.from("candidaturas_profissional").select("id, area_atuacao, email, whatsapp, tipo_documento, credencial_link, mensagem, criado_em, perfil_id, perfis:perfil_id(nome)").eq("status", "Pendente").order("criado_em", { ascending: true }),
      supabase.from("perfis").select("id", { count: "exact", head: true }).gte("criado_em", diasAtras(7)),
      supabase.from("assinaturas").select("id, perfil_id, status, valor_pago, criado_em, perfis:perfil_id(nome)").eq("status", "ativa").order("criado_em", { ascending: false }).limit(5),
      supabase.from("clube_holos").select("id").eq("mes_referencia", primeiroDiaMesISO).maybeSingle(),
      supabase.from("rodas_holos").select("id").gte("data_hora", new Date().toISOString()).limit(1),
      supabase.from("perfis").select("id, nome").eq("plano", "Premium"),
      supabase.from("avaliacoes_evolutivas").select("usuario_id, entregue_em"),
      supabase.from("loja_holos").select("id, titulo, descricao, categoria, link_afiliado, imagem_url, destaque, criado_em").order("criado_em", { ascending: false }),
      supabase
        .from("matches")
        .select("id, status, criado_em, usuario:usuario_id(nome, email), profissional:profissional_id(nome)")
        .neq("status", "pago")
        .order("criado_em", { ascending: true }),
    ]);

    // avaliação evolutiva atrasada: premium sem avaliação nos últimos 90 dias
    const ultimaAvaliacaoPorUsuario = {};
    (avaliacoesRes.data || []).forEach((a) => {
      if (!ultimaAvaliacaoPorUsuario[a.usuario_id] || a.entregue_em > ultimaAvaliacaoPorUsuario[a.usuario_id]) {
        ultimaAvaliacaoPorUsuario[a.usuario_id] = a.entregue_em;
      }
    });
    const limite90 = diasAtras(90);
    const avaliacoesAtrasadas = (premiumRes.data || []).filter((p) => {
      const ultima = ultimaAvaliacaoPorUsuario[p.id];
      return !ultima || ultima < limite90;
    });

    setAlertas({
      reflexoesAtivas: reflexoesRes.count || 0,
      conteudosPendentes: (conteudosPendRes.data || []).length,
      candidaturasPendentes: (candidaturasRes.data || []).length,
      novosUsuarios: novosUsuariosRes.count || 0,
      assinaturasRecentes: assinaturasRes.data || [],
      avaliacoesAtrasadas,
      clubeDoMesExiste: !!clubeMesRes.data,
      rodaFuturaExiste: (rodaFuturaRes.data || []).length > 0,
    });

    setCandidaturas(candidaturasRes.data || []);
    setConteudosPend(conteudosPendRes.data || []);
    setProdutosLoja(produtosLojaRes.data || []);
    setSolicitacoesMatch(solicitacoesMatchRes.data || []);
    setCarregando(false);
  }

  useEffect(() => {
    if (perfil?.papel === "Admin") carregarTudo();
  }, [perfil]);

  if (perfil && perfil.papel !== "Admin") {
    return <Navigate to="/perfil" replace />;
  }

  async function aprovarCandidatura(c) {
    await supabase.from("perfis").update({ papel: "Profissional" }).eq("id", c.perfil_id);
    await supabase.from("candidaturas_profissional").update({ status: "Aprovada" }).eq("id", c.id);
    setMensagemAcao(`${c.perfis?.nome || "Candidato"} agora é Profissional.`);
    carregarTudo();
  }

  async function rejeitarCandidatura(c) {
    await supabase.from("candidaturas_profissional").update({ status: "Rejeitada" }).eq("id", c.id);
    setMensagemAcao(`Candidatura de ${c.perfis?.nome || "candidato"} rejeitada.`);
    carregarTudo();
  }

  async function aprovarConteudo(c) {
    await supabase.from("conteudos").update({ status: "Aprovado" }).eq("id", c.id);
    setMensagemAcao(`Conteúdo "${c.titulo}" aprovado.`);
    carregarTudo();
  }

  async function rejeitarConteudo(c) {
    await supabase.from("conteudos").update({ status: "Rejeitado" }).eq("id", c.id);
    setMensagemAcao(`Conteúdo "${c.titulo}" rejeitado.`);
    carregarTudo();
  }

  async function cadastrarRoda(e) {
    e.preventDefault();
    if (!formRoda.titulo || !formRoda.link_meet || !formRoda.data_hora) return;
    await supabase.from("rodas_holos").insert({
      titulo: formRoda.titulo,
      descricao: formRoda.descricao || null,
      link_meet: formRoda.link_meet,
      data_hora: formRoda.data_hora,
    });
    setFormRoda({ titulo: "", descricao: "", link_meet: "", data_hora: "" });
    setMensagemAcao("Roda cadastrada.");
    carregarTudo();
  }

  async function cadastrarClube(e) {
    e.preventDefault();
    if (!formClube.livro_titulo || !formClube.livro_autor || !formClube.link_grupo) return;
    const hoje = new Date();
    const primeiroDiaMesISO = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-01`;
    await supabase.from("clube_holos").upsert(
      {
        mes_referencia: primeiroDiaMesISO,
        livro_titulo: formClube.livro_titulo,
        livro_autor: formClube.livro_autor,
        descricao: formClube.descricao || null,
        link_grupo: formClube.link_grupo,
        data_encontro: formClube.data_encontro || null,
      },
      { onConflict: "mes_referencia" }
    );
    setFormClube({ livro_titulo: "", livro_autor: "", descricao: "", link_grupo: "", data_encontro: "" });
    setMensagemAcao("Clube Holos deste mês cadastrado/atualizado.");
    carregarTudo();
  }

  async function cadastrarProduto(e) {
    e.preventDefault();
    if (!formLoja.titulo || !formLoja.link_afiliado) return;
    await supabase.from("loja_holos").insert({
      titulo: formLoja.titulo,
      descricao: formLoja.descricao || null,
      categoria: formLoja.categoria,
      link_afiliado: formLoja.link_afiliado,
      imagem_url: formLoja.imagem_url || null,
      destaque: formLoja.destaque || null,
    });
    setFormLoja({ titulo: "", descricao: "", categoria: "livros", link_afiliado: "", imagem_url: "", destaque: "" });
    setMensagemAcao("Produto cadastrado na Loja.");
    carregarTudo();
  }

  async function excluirProduto(id, titulo) {
    if (!window.confirm(`Remover "${titulo}" da Loja?`)) return;
    await supabase.from("loja_holos").delete().eq("id", id);
    setMensagemAcao(`"${titulo}" removido da Loja.`);
    carregarTudo();
  }

  async function buscarPerfis(e) {
    e.preventDefault();
    if (!buscaPerfil.trim()) return;
    setBuscando(true);
    const { data } = await supabase
      .from("perfis")
      .select("id, nome, email, papel, plano, suspenso")
      .ilike("nome", `%${buscaPerfil.trim()}%`)
      .limit(10);
    setResultadosBusca(data || []);
    setBuscando(false);
  }

  async function rebaixarProfissional(p) {
    if (!window.confirm(`Rebaixar ${p.nome} de Profissional pra Usuário?`)) return;
    await supabase.from("perfis").update({ papel: "Usuario" }).eq("id", p.id);
    setMensagemAcao(`${p.nome} rebaixado pra Usuário.`);
    setResultadosBusca((prev) => prev.map((x) => (x.id === p.id ? { ...x, papel: "Usuario" } : x)));
  }

  async function alternarSuspensao(p) {
    const novoValor = !p.suspenso;
    if (!window.confirm(`${novoValor ? "Suspender" : "Reativar"} a conta de ${p.nome}?`)) return;
    await supabase.from("perfis").update({ suspenso: novoValor }).eq("id", p.id);
    setMensagemAcao(`${p.nome} ${novoValor ? "suspenso" : "reativado"}.`);
    setResultadosBusca((prev) => prev.map((x) => (x.id === p.id ? { ...x, suspenso: novoValor } : x)));
  }

  async function avancarSolicitacao(s, novoStatus) {
    await supabase.from("matches").update({ status: novoStatus }).eq("id", s.id);
    setMensagemAcao(`Solicitação de ${s.usuario?.nome || "usuário"} → ${novoStatus}.`);
    carregarTudo();
  }

  if (carregando) {
    return (
      <div className="page-content">
        <h2 className="page-title">Painel Admin</h2>
        <p className="page-subtitle">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="page-content">
      <h2 className="page-title">Painel Admin</h2>
      <p className="page-subtitle">alertas e gestão da Holos</p>

      {mensagemAcao && <p className="page-subtitle" style={{ color: "var(--gold)" }}>{mensagemAcao}</p>}

      <p className="section-label">Alertas</p>
      <div className="card" style={{ marginBottom: 16 }}>
        {alertas.reflexoesAtivas < 30 && (
          <div className="metrica-row"><span className="metrica-label">⚠️ Só {alertas.reflexoesAtivas} reflexões ativas (menos de 30, vão repetir dentro do mês)</span></div>
        )}
        {alertas.conteudosPendentes > 0 && (
          <div className="metrica-row"><span className="metrica-label">📄 {alertas.conteudosPendentes} conteúdo(s) aguardando aprovação</span></div>
        )}
        {alertas.candidaturasPendentes > 0 && (
          <div className="metrica-row"><span className="metrica-label">🧑‍⚕️ {alertas.candidaturasPendentes} candidatura(s) de Profissional pendente(s)</span></div>
        )}
        {alertas.avaliacoesAtrasadas.length > 0 && (
          <div className="metrica-row"><span className="metrica-label">📋 {alertas.avaliacoesAtrasadas.length} usuário(s) Premium com Avaliação Evolutiva atrasada</span></div>
        )}
        {!alertas.clubeDoMesExiste && (
          <div className="metrica-row"><span className="metrica-label">📚 Clube Holos deste mês ainda não foi cadastrado</span></div>
        )}
        {!alertas.rodaFuturaExiste && (
          <div className="metrica-row"><span className="metrica-label">🗣️ Nenhuma Roda Holos futura agendada</span></div>
        )}
        <div className="metrica-row"><span className="metrica-label">👥 {alertas.novosUsuarios} novo(s) usuário(s) nos últimos 7 dias</span></div>
        {alertas.assinaturasRecentes.length > 0 && (
          <div>
            <p className="page-subtitle" style={{ marginTop: 8, marginBottom: 4 }}>Assinaturas ativas recentes:</p>
            {alertas.assinaturasRecentes.map((a) => (
              <p key={a.id} className="page-subtitle" style={{ margin: 0, fontSize: 12 }}>
                {a.perfis?.nome} — R$ {a.valor_pago}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="divider" />

      <p className="section-label">Candidaturas de Profissional</p>
      {candidaturas.length === 0 ? (
        <p className="page-subtitle" style={{ marginBottom: 16 }}>Nenhuma pendente.</p>
      ) : (
        candidaturas.map((c) => {
          const diasEsperando = Math.floor((Date.now() - new Date(c.criado_em).getTime()) / 86400000);
          return (
          <div className="card" key={c.id} style={{ marginBottom: 8 }}>
            <p style={{ fontWeight: 500, fontSize: 14 }}>{c.perfis?.nome}</p>
            <p className="page-subtitle" style={{ fontSize: 12 }}>{c.area_atuacao} · doc: {c.tipo_documento || "não informado"}</p>
            <p className="page-subtitle" style={{ fontSize: 12 }}>{c.email} · {c.whatsapp}</p>
            <p className="page-subtitle" style={{ fontSize: 12, color: diasEsperando >= 2 ? "var(--gold)" : undefined }}>
              ⏱️ esperando há {diasEsperando === 0 ? "menos de 1 dia" : `${diasEsperando} dia(s)`}
            </p>
            {c.credencial_link && (
              <p className="page-subtitle" style={{ fontSize: 12 }}>
                <a href={c.credencial_link} target="_blank" rel="noreferrer" style={{ color: "var(--gold)" }}>ver credencial</a>
              </p>
            )}
            {c.mensagem && <p style={{ fontSize: 13, marginTop: 4 }}>{c.mensagem}</p>}
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button className="btn btn-gold btn-sm" style={{ flex: 1 }} onClick={() => aprovarCandidatura(c)}>Aprovar</button>
              <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => rejeitarCandidatura(c)}>Rejeitar</button>
            </div>
          </div>
          );
        })
      )}

      <div className="divider" />

      <p className="section-label">Solicitações de Match</p>
      {solicitacoesMatch.length === 0 ? (
        <p className="page-subtitle" style={{ marginBottom: 16 }}>Nenhuma em andamento.</p>
      ) : (
        solicitacoesMatch.map((s) => {
          const acoes = {
            pendente: { label: "Aprovar", novo: "aprovado", lembrete: "📧 Envie o e-mail 1: como funciona, valor da consulta, pagamento fora da plataforma." },
            aprovado: { label: null, novo: null, lembrete: "⏳ Aguardando o usuário confirmar interesse pelo app." },
            confirmado: { label: "Marcar boleto enviado", novo: "aguardando_pagamento", lembrete: "📩 Gere e envie o boleto pro usuário." },
            aguardando_pagamento: { label: "Marcar pago e liberar contato", novo: "pago", lembrete: "💳 Confirme o pagamento antes de clicar — isso libera o contato do profissional pro usuário." },
          };
          const acao = acoes[s.status] || {};
          return (
            <div className="card" key={s.id} style={{ marginBottom: 8 }}>
              <p style={{ fontWeight: 500, fontSize: 14 }}>{s.usuario?.nome} → {s.profissional?.nome}</p>
              <p className="page-subtitle" style={{ fontSize: 12 }}>{s.usuario?.email}</p>
              <p className="page-subtitle" style={{ fontSize: 12 }}>status: {s.status} · {new Date(s.criado_em).toLocaleDateString("pt-BR")}</p>
              {acao.lembrete && <p style={{ fontSize: 12, marginTop: 4, color: "var(--gold)" }}>{acao.lembrete}</p>}
              {acao.label && (
                <button className="btn btn-gold btn-sm" style={{ marginTop: 8 }} onClick={() => avancarSolicitacao(s, acao.novo)}>
                  {acao.label}
                </button>
              )}
            </div>
          );
        })
      )}

      <div className="divider" />

      <p className="section-label">Conteúdos pendentes</p>
      {conteudosPend.length === 0 ? (
        <p className="page-subtitle" style={{ marginBottom: 16 }}>Nenhum pendente.</p>
      ) : (
        conteudosPend.map((c) => (
          <div className="card" key={c.id} style={{ marginBottom: 8 }}>
            <p style={{ fontWeight: 500, fontSize: 14 }}>{c.titulo}</p>
            <p className="page-subtitle" style={{ fontSize: 12 }}>{c.formato} · {c.plano_minimo}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button className="btn btn-gold btn-sm" style={{ flex: 1 }} onClick={() => aprovarConteudo(c)}>Aprovar</button>
              <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => rejeitarConteudo(c)}>Rejeitar</button>
            </div>
          </div>
        ))
      )}

      <div className="divider" />

      <p className="section-label">Cadastrar Roda Holos</p>
      <form onSubmit={cadastrarRoda} style={{ marginBottom: 16 }}>
        <div className="input-group">
          <label className="input-label">Título</label>
          <input className="input" value={formRoda.titulo} onChange={(e) => setFormRoda({ ...formRoda, titulo: e.target.value })} />
        </div>
        <div className="input-group">
          <label className="input-label">Descrição</label>
          <input className="input" value={formRoda.descricao} onChange={(e) => setFormRoda({ ...formRoda, descricao: e.target.value })} />
        </div>
        <div className="input-group">
          <label className="input-label">Link do Meet</label>
          <input className="input" value={formRoda.link_meet} onChange={(e) => setFormRoda({ ...formRoda, link_meet: e.target.value })} placeholder="https://meet.google.com/..." />
        </div>
        <div className="input-group">
          <label className="input-label">Data e horário</label>
          <input className="input" type="datetime-local" value={formRoda.data_hora} onChange={(e) => setFormRoda({ ...formRoda, data_hora: e.target.value })} />
        </div>
        <button className="btn btn-gold" type="submit">Cadastrar Roda</button>
      </form>

      <div className="divider" />

      <p className="section-label">Clube Holos deste mês</p>
      <form onSubmit={cadastrarClube} style={{ marginBottom: 16 }}>
        <div className="input-group">
          <label className="input-label">Título do livro</label>
          <input className="input" value={formClube.livro_titulo} onChange={(e) => setFormClube({ ...formClube, livro_titulo: e.target.value })} />
        </div>
        <div className="input-group">
          <label className="input-label">Autor</label>
          <input className="input" value={formClube.livro_autor} onChange={(e) => setFormClube({ ...formClube, livro_autor: e.target.value })} />
        </div>
        <div className="input-group">
          <label className="input-label">Descrição</label>
          <input className="input" value={formClube.descricao} onChange={(e) => setFormClube({ ...formClube, descricao: e.target.value })} />
        </div>
        <div className="input-group">
          <label className="input-label">Link do grupo</label>
          <input className="input" value={formClube.link_grupo} onChange={(e) => setFormClube({ ...formClube, link_grupo: e.target.value })} />
        </div>
        <div className="input-group">
          <label className="input-label">Data do encontro</label>
          <input className="input" type="datetime-local" value={formClube.data_encontro} onChange={(e) => setFormClube({ ...formClube, data_encontro: e.target.value })} />
        </div>
        <button className="btn btn-gold" type="submit">Salvar Clube do mês</button>
      </form>

      <div className="divider" />

      <p className="section-label">Produtos da Loja</p>
      {produtosLoja.length === 0 ? (
        <p className="page-subtitle" style={{ marginBottom: 16 }}>Nenhum produto cadastrado ainda.</p>
      ) : (
        produtosLoja.map((p) => (
          <div className="card" key={p.id} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {p.imagem_url ? (
                <img src={p.imagem_url} alt={p.titulo} style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} />
              ) : (
                <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--bg-card-soft)" }} />
              )}
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 500, fontSize: 14, margin: 0 }}>{p.titulo}</p>
                <p className="page-subtitle" style={{ fontSize: 12, margin: 0 }}>
                  {p.categoria}{p.destaque ? ` · ${p.destaque === "promocao" ? "Promoção" : "Novidade"}` : ""}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <a className="btn btn-outline btn-sm" style={{ flex: 1, textAlign: "center" }} href={p.link_afiliado} target="_blank" rel="noreferrer">Ver link</a>
              <button className="btn btn-outline btn-sm" style={{ flex: 1, color: "var(--danger, #c0392b)" }} onClick={() => excluirProduto(p.id, p.titulo)}>Remover</button>
            </div>
          </div>
        ))
      )}

      <form onSubmit={cadastrarProduto} style={{ marginTop: 12 }}>
        <div className="input-group">
          <label className="input-label">Título do produto</label>
          <input className="input" value={formLoja.titulo} onChange={(e) => setFormLoja({ ...formLoja, titulo: e.target.value })} />
        </div>
        <div className="input-group">
          <label className="input-label">Descrição</label>
          <input className="input" value={formLoja.descricao} onChange={(e) => setFormLoja({ ...formLoja, descricao: e.target.value })} />
        </div>
        <div className="input-group">
          <label className="input-label">Categoria</label>
          <select className="input" value={formLoja.categoria} onChange={(e) => setFormLoja({ ...formLoja, categoria: e.target.value })}>
            <option value="livros">Livros</option>
            <option value="papelaria">Papelaria</option>
            <option value="eletronicos">Eletrônicos</option>
            <option value="ambiente">Ambiente</option>
          </select>
        </div>
        <div className="input-group">
          <label className="input-label">Link de afiliado</label>
          <input className="input" value={formLoja.link_afiliado} onChange={(e) => setFormLoja({ ...formLoja, link_afiliado: e.target.value })} placeholder="https://..." />
        </div>
        <div className="input-group">
          <label className="input-label">URL da imagem (opcional)</label>
          <input className="input" value={formLoja.imagem_url} onChange={(e) => setFormLoja({ ...formLoja, imagem_url: e.target.value })} placeholder="https://..." />
        </div>
        <div className="input-group">
          <label className="input-label">Destaque (opcional)</label>
          <select className="input" value={formLoja.destaque} onChange={(e) => setFormLoja({ ...formLoja, destaque: e.target.value })}>
            <option value="">Nenhum</option>
            <option value="promocao">Promoção</option>
            <option value="novidade">Novidade</option>
          </select>
        </div>
        <button className="btn btn-gold" type="submit">Cadastrar produto</button>
      </form>

      <div className="divider" />

      <p className="section-label">Gestão de Profissionais e Usuários</p>
      <form onSubmit={buscarPerfis} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          className="input"
          style={{ flex: 1 }}
          value={buscaPerfil}
          onChange={(e) => setBuscaPerfil(e.target.value)}
          placeholder="Buscar por nome..."
        />
        <button className="btn btn-outline btn-sm" type="submit" disabled={buscando}>
          {buscando ? "..." : "Buscar"}
        </button>
      </form>

      {resultadosBusca.map((p) => (
        <div className="card" key={p.id} style={{ marginBottom: 8 }}>
          <p style={{ fontWeight: 500, fontSize: 14 }}>
            {p.nome} {p.suspenso && <span className="badge-admin" style={{ fontSize: 10, marginLeft: 6 }}>suspenso</span>}
          </p>
          <p className="page-subtitle" style={{ fontSize: 12 }}>{p.email} · papel: {p.papel} · plano: {p.plano}</p>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            {p.papel === "Profissional" && (
              <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => rebaixarProfissional(p)}>
                Rebaixar pra Usuário
              </button>
            )}
            <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => alternarSuspensao(p)}>
              {p.suspenso ? "Reativar" : "Suspender"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

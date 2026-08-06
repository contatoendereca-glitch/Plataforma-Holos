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
    ] = await Promise.all([
      supabase.from("reflexoes_diarias").select("id", { count: "exact", head: true }).eq("ativo", true),
      supabase.from("conteudos").select("id, titulo, formato, plano_minimo, autor_id, criado_em").eq("status", "Pendente").order("criado_em", { ascending: false }),
      supabase.from("candidaturas_profissional").select("id, area_atuacao, email, whatsapp, credencial_link, mensagem, criado_em, perfil_id, perfis:perfil_id(nome)").eq("status", "Pendente").order("criado_em", { ascending: false }),
      supabase.from("perfis").select("id", { count: "exact", head: true }).gte("criado_em", diasAtras(7)),
      supabase.from("assinaturas").select("id, perfil_id, status, valor_pago, criado_em, perfis:perfil_id(nome)").eq("status", "ativa").order("criado_em", { ascending: false }).limit(5),
      supabase.from("clube_holos").select("id").eq("mes_referencia", primeiroDiaMesISO).maybeSingle(),
      supabase.from("rodas_holos").select("id").gte("data_hora", new Date().toISOString()).limit(1),
      supabase.from("perfis").select("id, nome").eq("plano", "Premium"),
      supabase.from("avaliacoes_evolutivas").select("usuario_id, entregue_em"),
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
        candidaturas.map((c) => (
          <div className="card" key={c.id} style={{ marginBottom: 8 }}>
            <p style={{ fontWeight: 500, fontSize: 14 }}>{c.perfis?.nome}</p>
            <p className="page-subtitle" style={{ fontSize: 12 }}>{c.area_atuacao}</p>
            <p className="page-subtitle" style={{ fontSize: 12 }}>{c.email} · {c.whatsapp}</p>
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
        ))
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
    </div>
  );
}

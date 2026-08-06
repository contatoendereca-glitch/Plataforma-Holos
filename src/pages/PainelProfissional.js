import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import NavAcoes from "../components/NavAcoes";

const FORMATOS = ["Texto", "Audio"];

export default function PainelProfissional() {
  const { perfil } = useAuth();
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [conteudos, setConteudos] = useState([]);
  const [dores, setDores] = useState([]);
  const [instancias, setInstancias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);

  const [form, setForm] = useState({
    titulo: "",
    dor_id: "",
    instancia_id: "",
    formato: "Texto",
    url_externa: "",
    plano_minimo: "Gratuito",
    descricao: "",
  });

  async function carregar() {
    const [matchesRes, conteudosRes, doresRes, instanciasRes] = await Promise.all([
      supabase
        .from("matches")
        .select("id, criado_em, ajudou, usuario:usuario_id(nome)")
        .eq("profissional_id", perfil.id)
        .order("criado_em", { ascending: false }),
      supabase
        .from("conteudos")
        .select("id, titulo, status, plano_minimo, criado_em")
        .eq("autor_id", perfil.id)
        .order("criado_em", { ascending: false }),
      supabase.from("dores").select("id, nome").eq("ativo", true).order("ordem"),
      supabase.from("instancias").select("id, nome").order("ordem"),
    ]);

    setMatches(matchesRes.data || []);
    setConteudos(conteudosRes.data || []);
    setDores(doresRes.data || []);
    setInstancias(instanciasRes.data || []);
    setCarregando(false);
  }

  useEffect(() => {
    if (perfil?.papel === "Profissional") carregar();
  }, [perfil]);

  if (perfil && perfil.papel !== "Profissional") {
    return <Navigate to="/perfil" replace />;
  }

  function atualizarCampo(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function enviarConteudo(e) {
    e.preventDefault();
    if (!form.titulo || !form.dor_id || !form.instancia_id || !form.url_externa) {
      setErro("Preencha título, dor, eixo e o link antes de enviar.");
      return;
    }
    setEnviando(true);
    setErro(null);
    setSucesso(false);

    const { error } = await supabase.from("conteudos").insert({
      titulo: form.titulo,
      dor_id: form.dor_id,
      instancia_id: form.instancia_id,
      formato: form.formato,
      url_externa: form.url_externa,
      plano_minimo: form.plano_minimo,
      descricao: form.descricao,
      status: "Pendente",
      autor_id: perfil.id,
    });

    setEnviando(false);
    if (error) {
      setErro(`Não foi possível enviar: ${error.message}`);
      return;
    }
    setSucesso(true);
    setForm({ titulo: "", dor_id: "", instancia_id: "", formato: "Texto", url_externa: "", plano_minimo: "Gratuito", descricao: "" });
    carregar();
  }

  const totalMatches = matches.length;
  const matchesAjudou = matches.filter((m) => m.ajudou).length;

  return (
    <div className="page-content">
      <NavAcoes voltarPara="/perfil" />
      <h2 className="page-title">Painel do Profissional</h2>
      <p className="page-subtitle">seus matches e conteúdos enviados</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <div className="card" style={{ flex: 1, textAlign: "center" }}>
          <p style={{ fontFamily: "Cinzel, serif", color: "var(--gold)", fontSize: 18 }}>{perfil?.pontos_ajudou || 0}</p>
          <p className="page-subtitle" style={{ margin: 0, fontSize: 10 }}>pontos</p>
        </div>
        <div className="card" style={{ flex: 1, textAlign: "center" }}>
          <p style={{ fontFamily: "Cinzel, serif", color: "var(--gold)", fontSize: 18 }}>{totalMatches}</p>
          <p className="page-subtitle" style={{ margin: 0, fontSize: 10 }}>matches</p>
        </div>
        <div className="card" style={{ flex: 1, textAlign: "center" }}>
          <p style={{ fontFamily: "Cinzel, serif", color: "var(--gold)", fontSize: 18 }}>{matchesAjudou}</p>
          <p className="page-subtitle" style={{ margin: 0, fontSize: 10 }}>marcaram ajudou</p>
        </div>
      </div>

      <div className="divider" />

      <p className="section-label">Meus matches</p>
      {carregando ? (
        <p className="page-subtitle">Carregando...</p>
      ) : matches.length === 0 ? (
        <p className="page-subtitle" style={{ marginBottom: 16 }}>Ninguém solicitou match ainda.</p>
      ) : (
        matches.map((m) => (
          <div className="pro-card" key={m.id} style={{ marginBottom: 8 }}>
            <div className="avatar">{(m.usuario?.nome || "?").slice(0, 2).toUpperCase()}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 500, fontSize: 13, marginBottom: 2 }}>{m.usuario?.nome || "Usuário"}</p>
              <p className="page-subtitle" style={{ margin: 0, fontSize: 12 }}>
                {new Date(m.criado_em).toLocaleDateString("pt-BR")}
              </p>
            </div>
            {m.ajudou && <span className="badge-gratuito">💛 ajudou</span>}
          </div>
        ))
      )}

      <div className="divider" />

      <p className="section-label">Enviar conteúdo</p>
      <p className="page-subtitle" style={{ marginTop: -4, marginBottom: 12 }}>
        entra como "Pendente" até o Admin aprovar
      </p>

      {erro && <p className="erro-msg">{erro}</p>}
      {sucesso && <p className="page-subtitle" style={{ color: "var(--gold)" }}>Enviado! Aguardando aprovação do Admin.</p>}

      <form onSubmit={enviarConteudo}>
        <div className="input-group">
          <label className="input-label">Título</label>
          <input className="input" value={form.titulo} onChange={(e) => atualizarCampo("titulo", e.target.value)} />
        </div>

        <div className="input-group">
          <label className="input-label">Dor</label>
          <select className="input" value={form.dor_id} onChange={(e) => atualizarCampo("dor_id", e.target.value)}>
            <option value="">Selecione</option>
            {dores.map((d) => (
              <option key={d.id} value={d.id}>{d.nome}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">Eixo</label>
          <select className="input" value={form.instancia_id} onChange={(e) => atualizarCampo("instancia_id", e.target.value)}>
            <option value="">Selecione</option>
            {instancias.map((i) => (
              <option key={i.id} value={i.id}>{i.nome}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">Formato</label>
          <select className="input" value={form.formato} onChange={(e) => atualizarCampo("formato", e.target.value)}>
            {FORMATOS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">Link (YouTube não-listado, Drive, Spotify...)</label>
          <input className="input" value={form.url_externa} onChange={(e) => atualizarCampo("url_externa", e.target.value)} placeholder="https://..." />
        </div>

        <div className="input-group">
          <label className="input-label">Plano mínimo</label>
          <select className="input" value={form.plano_minimo} onChange={(e) => atualizarCampo("plano_minimo", e.target.value)}>
            <option value="Gratuito">Gratuito</option>
            <option value="Premium">Premium</option>
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">Descrição</label>
          <input className="input" value={form.descricao} onChange={(e) => atualizarCampo("descricao", e.target.value)} />
        </div>

        <button className="btn btn-gold" type="submit" disabled={enviando}>
          {enviando ? "Enviando..." : "Enviar conteúdo"}
        </button>
      </form>

      <div className="divider" />

      <p className="section-label">Meus conteúdos enviados</p>
      {conteudos.length === 0 ? (
        <p className="page-subtitle">Você ainda não enviou nenhum conteúdo.</p>
      ) : (
        conteudos.map((c) => (
          <div className="metrica-row" key={c.id}>
            <span className="metrica-label">{c.titulo}</span>
            <span className={c.status === "Aprovado" ? "badge-premium" : "badge-gratuito"}>{c.status}</span>
          </div>
        ))
      )}
    </div>
  );
}

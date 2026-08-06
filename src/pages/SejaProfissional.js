import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import NavAcoes from "../components/NavAcoes";

export default function SejaProfissional() {
  const { perfil } = useAuth();
  const [candidatura, setCandidatura] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  const [form, setForm] = useState({ area_atuacao: "", credencial_link: "", mensagem: "" });

  useEffect(() => {
    async function carregar() {
      const { data } = await supabase
        .from("candidaturas_profissional")
        .select("id, area_atuacao, status, criado_em")
        .eq("perfil_id", perfil.id)
        .order("criado_em", { ascending: false })
        .limit(1)
        .maybeSingle();
      setCandidatura(data);
      setCarregando(false);
    }
    if (perfil?.id) carregar();
  }, [perfil]);

  function atualizarCampo(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function enviar(e) {
    e.preventDefault();
    if (!form.area_atuacao) {
      setErro("Conta pra gente sua área de atuação antes de enviar.");
      return;
    }
    setEnviando(true);
    setErro(null);
    const { error } = await supabase.from("candidaturas_profissional").insert({
      perfil_id: perfil.id,
      area_atuacao: form.area_atuacao,
      credencial_link: form.credencial_link || null,
      mensagem: form.mensagem || null,
    });
    setEnviando(false);
    if (error) {
      setErro(`Não foi possível enviar: ${error.message}`);
      return;
    }
    setCandidatura({ area_atuacao: form.area_atuacao, status: "Pendente", criado_em: new Date().toISOString() });
  }

  if (carregando) {
    return (
      <div className="page-content">
        <NavAcoes voltarPara="/perfil" />
        <p className="page-subtitle">Carregando...</p>
      </div>
    );
  }

  if (candidatura) {
    const statusInfo = {
      Pendente: { texto: "Sua candidatura está em análise. A gente avisa por aqui assim que revisarmos.", badge: "badge-gratuito" },
      Aprovada: { texto: "Sua candidatura foi aprovada! Você já é Profissional Holos — dá uma olhada no seu novo painel no Perfil.", badge: "badge-premium" },
      Rejeitada: { texto: "Por enquanto sua candidatura não foi aprovada. Fale com a gente se quiser entender melhor ou tentar de novo.", badge: "badge-admin" },
    }[candidatura.status];

    return (
      <div className="page-content">
        <NavAcoes voltarPara="/perfil" />
        <h2 className="page-title">Seja Profissional Holos</h2>
        <div className="card-gold">
          <span className={statusInfo.badge}>{candidatura.status}</span>
          <p style={{ marginTop: 10 }}>{statusInfo.texto}</p>
          <p className="page-subtitle" style={{ fontSize: 12, marginTop: 8 }}>
            Área informada: {candidatura.area_atuacao}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <NavAcoes voltarPara="/perfil" />
      <h2 className="page-title">Seja Profissional Holos</h2>
      <p className="page-subtitle">
        conta um pouco sobre você — sem chamada, sem compromisso. A gente analisa e te avisa por aqui.
      </p>

      {erro && <p className="erro-msg">{erro}</p>}

      <form onSubmit={enviar}>
        <div className="input-group">
          <label className="input-label">Área de atuação</label>
          <input
            className="input"
            value={form.area_atuacao}
            onChange={(e) => atualizarCampo("area_atuacao", e.target.value)}
            placeholder="ex: Psicóloga clínica, Psicanalista, Terapeuta..."
          />
        </div>

        <div className="input-group">
          <label className="input-label">Link de credencial (CRP, Instagram profissional, LinkedIn...)</label>
          <input
            className="input"
            value={form.credencial_link}
            onChange={(e) => atualizarCampo("credencial_link", e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="input-group">
          <label className="input-label">Quer contar mais alguma coisa? (opcional)</label>
          <input
            className="input"
            value={form.mensagem}
            onChange={(e) => atualizarCampo("mensagem", e.target.value)}
          />
        </div>

        <button className="btn btn-gold" type="submit" disabled={enviando}>
          {enviando ? "Enviando..." : "Enviar candidatura"}
        </button>
      </form>
    </div>
  );
}

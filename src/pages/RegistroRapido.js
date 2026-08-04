import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function RegistroRapido() {
  const { perfil } = useAuth();
  const [aba, setAba] = useState("gratidao");
  const [campo1, setCampo1] = useState("");
  const [campo2, setCampo2] = useState("");
  const [campo3, setCampo3] = useState("");
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null); // "gratidao" | "diario" | null

  async function salvarGratidao() {
    if (!campo1 || !campo2 || !campo3) {
      setErro("Preencha os 3 campos antes de registrar.");
      return;
    }
    setSalvando(true);
    setErro(null);
    const { error } = await supabase.from("gratidoes").insert({
      usuario_id: perfil.id,
      campo_1: campo1,
      campo_2: campo2,
      campo_3: campo3,
    });
    setSalvando(false);
    if (error) { setErro("Não foi possível salvar."); return; }
    setSucesso("gratidao");
  }

  async function salvarDiario() {
    if (!conteudo.trim()) {
      setErro("Escreva algo antes de registrar.");
      return;
    }
    setSalvando(true);
    setErro(null);
    const { error } = await supabase.from("diario_holos").insert({
      usuario_id: perfil.id,
      titulo: titulo || null,
      conteudo,
    });
    setSalvando(false);
    if (error) { setErro("Não foi possível salvar."); return; }
    setSucesso("diario");
  }

  if (sucesso) {
    return (
      <div className="page-content" style={{ textAlign: "center", paddingTop: 60 }}>
        <p style={{ fontSize: 40, marginBottom: 12 }}>✓</p>
        <h2 className="page-title">{sucesso === "gratidao" ? "Gratidão registrada" : "Registro salvo"}</h2>
        <p className="page-subtitle">isso fica guardado no seu Calendário</p>
        <Link className="btn btn-gold" to="/calendario">Ver no Calendário</Link>
        <button
          className="btn btn-outline"
          onClick={() => { setSucesso(null); setCampo1(""); setCampo2(""); setCampo3(""); setTitulo(""); setConteudo(""); }}
        >
          Registrar outro
        </button>
      </div>
    );
  }

  return (
    <div className="page-content">
      <h2 className="page-title">Registro rápido</h2>
      <p className="page-subtitle">gratidão e diário num só lugar</p>

      <div className="tabs">
        <button className={`tab ${aba === "gratidao" ? "active" : ""}`} onClick={() => setAba("gratidao")}>Gratidão</button>
        <button className={`tab ${aba === "diario" ? "active" : ""}`} onClick={() => setAba("diario")}>Diário Holos</button>
      </div>

      {erro && <p className="erro-msg">{erro}</p>}

      {aba === "gratidao" && (
        <div>
          <div className="input-group">
            <label className="input-label">Hoje eu sou grato por (1)</label>
            <input className="input" value={campo1} onChange={(e) => setCampo1(e.target.value)} placeholder="ex: minha saúde" />
          </div>
          <div className="input-group">
            <label className="input-label">Hoje eu sou grato por (2)</label>
            <input className="input" value={campo2} onChange={(e) => setCampo2(e.target.value)} placeholder="ex: um momento de paz" />
          </div>
          <div className="input-group">
            <label className="input-label">Hoje eu sou grato por (3)</label>
            <input className="input" value={campo3} onChange={(e) => setCampo3(e.target.value)} placeholder="ex: uma conversa boa" />
          </div>
          <button className="btn btn-gold" disabled={salvando} onClick={salvarGratidao}>
            {salvando ? "Salvando..." : "Registrar gratidão"}
          </button>
        </div>
      )}

      {aba === "diario" && (
        <div>
          <div className="input-group">
            <label className="input-label">Título (opcional)</label>
            <input className="input" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="ex: sobre o que percebi hoje" />
          </div>
          <div className="input-group">
            <label className="input-label">O que você quer registrar?</label>
            <textarea className="input" rows={6} value={conteudo} onChange={(e) => setConteudo(e.target.value)} placeholder="escreva livremente..." />
          </div>
          <button className="btn btn-gold" disabled={salvando} onClick={salvarDiario}>
            {salvando ? "Salvando..." : "Registrar no diário"}
          </button>
        </div>
      )}
    </div>
  );
}

// Corrigido: import de ../lib/supabase e useAuth() (não mais ../supabaseClient
// nem usePerfil()). Navega pra /home no final porque /calendario ainda não
// existe no projeto — troque quando o Calendário for construído.
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function Checkin() {
  const { perfil } = useAuth();
  const navigate = useNavigate();

  const [corpo, setCorpo] = useState("");
  const [alma, setAlma] = useState("");
  const [espirito, setEspirito] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  async function salvar() {
    if (!corpo || !alma || !espirito) {
      setErro("Preencha os 3 campos antes de registrar.");
      return;
    }
    setSalvando(true);
    setErro(null);
    const { error } = await supabase.from("checkins").insert({
      usuario_id: perfil.id,
      corpo,
      alma,
      espirito,
    });
    setSalvando(false);
    if (error) {
      setErro("Não foi possível salvar. Tente novamente.");
      return;
    }
    navigate("/home");
  }

  return (
    <div className="page-content">
      <h2 className="page-title">Check-in diário</h2>
      <p className="page-subtitle">como você está agora, nos 3 eixos</p>

      {erro && <p className="erro-msg">{erro}</p>}

      <div className="input-group">
        <label className="input-label">Corpo</label>
        <input className="input" value={corpo} onChange={(e) => setCorpo(e.target.value)} placeholder="ex: cansado, com energia, tenso..." />
      </div>
      <div className="input-group">
        <label className="input-label">Alma</label>
        <input className="input" value={alma} onChange={(e) => setAlma(e.target.value)} placeholder="ex: ansioso, em paz, confuso..." />
      </div>
      <div className="input-group">
        <label className="input-label">Espírito</label>
        <input className="input" value={espirito} onChange={(e) => setEspirito(e.target.value)} placeholder="ex: conectado, distante, em busca..." />
      </div>

      <button className="btn btn-gold" disabled={salvando} onClick={salvar}>
        {salvando ? "Salvando..." : "Registrar check-in"}
      </button>
    </div>
  );
}

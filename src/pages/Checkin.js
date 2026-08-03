// ATENÇÃO — assume colunas corpo, alma, espirito (texto livre) na tabela checkins.
// O documento diz "1 registro por dia" mas isso não está travado por constraint
// de banco ainda — se quiser travar de verdade, dá pra adicionar um unique
// composto em (usuario_id, date(criado_em)) num patch futuro.
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { usePerfil } from "../context/PerfilContext";

export default function Checkin() {
  const { perfil } = usePerfil();
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
    navigate("/calendario");
  }

  return (
    <div>
      <div className="topbar">
        <span onClick={() => navigate(-1)}>‹ Voltar</span>
        <span onClick={() => navigate("/")}>⌂ Início</span>
      </div>

      <h1>Check-in diário</h1>
      <p className="sub">como você está agora, nos 3 eixos</p>

      {erro && <p style={{ color: "#e07b6c", fontSize: 13 }}>{erro}</p>}

      <div className="card">
        <label>Corpo</label>
        <input value={corpo} onChange={(e) => setCorpo(e.target.value)} placeholder="ex: cansado, com energia, tenso..." />
      </div>
      <div className="card">
        <label>Alma</label>
        <input value={alma} onChange={(e) => setAlma(e.target.value)} placeholder="ex: ansioso, em paz, confuso..." />
      </div>
      <div className="card">
        <label>Espírito</label>
        <input value={espirito} onChange={(e) => setEspirito(e.target.value)} placeholder="ex: conectado, distante, em busca..." />
      </div>

      <button className="btn" disabled={salvando} onClick={salvar}>
        {salvando ? "Salvando..." : "Registrar check-in"}
      </button>
    </div>
  );
}

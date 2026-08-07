import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import NavAcoes from "../components/NavAcoes";

const EIXOS = [
  { chave: "nota_corpo", rotulo: "Corpo" },
  { chave: "nota_mente", rotulo: "Mente" },
  { chave: "nota_consciencia", rotulo: "Consciência" },
];

function hojeISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function SeletorNota({ valor, aoMudar }) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={valor === n ? "btn btn-gold btn-sm" : "btn btn-outline btn-sm"}
          style={{ flex: 1 }}
          onClick={() => aoMudar(n)}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

export default function Checkin() {
  const { perfil } = useAuth();
  const navigate = useNavigate();

  const [notas, setNotas] = useState({ nota_corpo: null, nota_mente: null, nota_consciencia: null });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);

  function definirNota(chave, valor) {
    setNotas((prev) => ({ ...prev, [chave]: valor }));
  }

  async function salvar() {
    if (!notas.nota_corpo || !notas.nota_mente || !notas.nota_consciencia) {
      setErro("Dê uma nota de 1 a 5 pros 3 eixos antes de registrar.");
      return;
    }
    setSalvando(true);
    setErro(null);
    const { error } = await supabase.from("checkins").upsert(
      {
        perfil_id: perfil.id,
        data: hojeISO(),
        nota_corpo: notas.nota_corpo,
        nota_mente: notas.nota_mente,
        nota_consciencia: notas.nota_consciencia,
      },
      { onConflict: "perfil_id,data" }
    );
    setSalvando(false);
    if (error) {
      console.error(error);
      setErro(`Não foi possível salvar: ${error.message}`);
      return;
    }
    setSucesso(true);
    setTimeout(() => navigate("/evolucao"), 1200);
  }

  return (
    <div className="page-content">
      <NavAcoes voltarPara="/cuidado" />
      <h2 className="page-title">Check-in diário</h2>
      <p className="page-subtitle">como você está agora, nos 3 eixos (1 = muito baixo, 5 = muito bem)</p>

      {erro && <p className="erro-msg">{erro}</p>}
      {sucesso && (
        <p className="page-subtitle" style={{ color: "var(--gold)", fontWeight: 500 }}>
          Check-in registrado! Indo pra Evolução...
        </p>
      )}

      {EIXOS.map((eixo) => (
        <div className="input-group" key={eixo.chave}>
          <label className="input-label">{eixo.rotulo}</label>
          <SeletorNota valor={notas[eixo.chave]} aoMudar={(v) => definirNota(eixo.chave, v)} />
        </div>
      ))}

      <button className="btn btn-gold" disabled={salvando || sucesso} onClick={salvar}>
        {salvando ? "Salvando..." : sucesso ? "Registrado ✓" : "Registrar check-in"}
      </button>
    </div>
  );
}

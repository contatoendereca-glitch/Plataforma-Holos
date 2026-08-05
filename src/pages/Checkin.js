import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import NavAcoes from "../components/NavAcoes";

const EIXOS = [
  { chave: "nota_corpo", rotulo: "Corpo", icone: "🫀" },
  { chave: "nota_alma", rotulo: "Alma", icone: "💛" },
  { chave: "nota_espirito", rotulo: "Espírito", icone: "✝️" },
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

  const [notas, setNotas] = useState({ nota_corpo: null, nota_alma: null, nota_espirito: null });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  function definirNota(chave, valor) {
    setNotas((prev) => ({ ...prev, [chave]: valor }));
  }

  async function salvar() {
    if (!notas.nota_corpo || !notas.nota_alma || !notas.nota_espirito) {
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
        nota_alma: notas.nota_alma,
        nota_espirito: notas.nota_espirito,
      },
      { onConflict: "perfil_id,data" }
    );
    setSalvando(false);
    if (error) {
      console.error(error);
      setErro(`Não foi possível salvar: ${error.message}`);
      return;
    }
    navigate("/evolucao");
  }

  return (
    <div className="page-content">
      <NavAcoes voltarPara="/cuidado" />
      <h2 className="page-title">Check-in diário</h2>
      <p className="page-subtitle">como você está agora, nos 3 eixos (1 = muito baixo, 5 = muito bem)</p>

      {erro && <p className="erro-msg">{erro}</p>}

      {EIXOS.map((eixo) => (
        <div className="input-group" key={eixo.chave}>
          <label className="input-label">{eixo.icone} {eixo.rotulo}</label>
          <SeletorNota valor={notas[eixo.chave]} aoMudar={(v) => definirNota(eixo.chave, v)} />
        </div>
      ))}

      <button className="btn btn-gold" disabled={salvando} onClick={salvar}>
        {salvando ? "Salvando..." : "Registrar check-in"}
      </button>
    </div>
  );
}

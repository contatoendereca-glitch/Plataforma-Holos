// Conversas com data marcada e link do Meet — cadastradas pelo Admin
// (rodas_holos). Até o Painel Admin existir, cadastre pelo SQL Editor:
//   insert into rodas_holos (titulo, descricao, link_meet, data_hora, criado_por)
//   values ('Ansiedade em tempos de excesso', null, 'https://meet.google.com/...',
//           '2026-08-10 19:30', '<uuid do admin>');
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { usePerfil } from "../context/PerfilContext";
import PremiumGate from "../components/PremiumGate";

export default function Rodas() {
  const { perfil } = usePerfil();
  const isPremium = perfil?.plano === "premium";
  const [rodas, setRodas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const { data } = await supabase
        .from("rodas_holos")
        .select("id, titulo, descricao, link_meet, data_hora")
        .order("data_hora");
      setRodas(data || []);
      setCarregando(false);
    }
    if (isPremium) carregar();
    else setCarregando(false);
  }, [isPremium]);

  if (!isPremium) {
    return (
      <div>
        <div className="topbar">
          <span onClick={() => window.history.back()}>‹ Voltar</span>
          <span onClick={() => (window.location.href = "/")}>⌂ Início</span>
        </div>
        <h1>Rodas Holos</h1>
        <PremiumGate
          titulo="Rodas Holos"
          descricao="conversas em grupo com data marcada, liberadas no Premium"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="topbar">
        <span onClick={() => window.history.back()}>‹ Voltar</span>
        <span onClick={() => (window.location.href = "/")}>⌂ Início</span>
      </div>

      <h1>Rodas Holos</h1>
      <p className="sub">conversas em grupo com data marcada</p>

      {carregando && <p className="sub">Carregando...</p>}
      {!carregando && rodas.length === 0 && (
        <p className="sub">Nenhuma roda agendada no momento.</p>
      )}

      {rodas.map((r) => (
        <div className="card" key={r.id}>
          <label>{r.titulo}</label>
          <p className="sub">
            {new Date(r.data_hora).toLocaleString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <button className="btn" onClick={() => window.open(r.link_meet, "_blank")}>
            Entrar na roda
          </button>
        </div>
      ))}
    </div>
  );
}

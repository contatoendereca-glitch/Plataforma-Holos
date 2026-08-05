import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import NavAcoes from "../components/NavAcoes";
import PremiumGate from "../components/PremiumGate";

export default function Rodas() {
  const { isPremium } = useAuth();
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

  return (
    <div className="page-content">
      <NavAcoes voltarPara="/comunidade" />
      <h2 className="page-title">Rodas Holos</h2>
      <p className="page-subtitle">conversas em grupo com data marcada</p>

      {!isPremium && (
        <PremiumGate titulo="Rodas Holos" descricao="conversas em grupo, liberadas no Premium" />
      )}

      {isPremium && carregando && <p className="page-subtitle">Carregando...</p>}
      {isPremium && !carregando && rodas.length === 0 && (
        <p className="page-subtitle">Nenhuma roda agendada no momento.</p>
      )}

      {isPremium &&
        rodas.map((r) => (
          <div className="card" key={r.id}>
            <p style={{ fontWeight: 500, marginBottom: 4 }}>{r.titulo}</p>
            <p className="page-subtitle">
              {new Date(r.data_hora).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <button className="btn btn-gold" onClick={() => window.open(r.link_meet, "_blank")}>
              Entrar na roda
            </button>
          </div>
        ))}
    </div>
  );
}

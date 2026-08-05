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

  function convidar(roda) {
    const quando = new Date(roda.data_hora).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
    const mensagem = `🗣️ Bora participar da Roda Holos "${roda.titulo}"?\n📅 ${quando}\n\n📲 https://plataforma-holos.vercel.app`
    window.open(`https://wa.me/?text=${encodeURIComponent(mensagem)}`, "_blank")
  }

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
          <div className="card" key={r.id} style={{ marginBottom: 12 }}>
            <p style={{ fontWeight: 500, marginBottom: 4 }}>{r.titulo}</p>
            {r.descricao && <p style={{ fontSize: 13, marginBottom: 6 }}>{r.descricao}</p>}
            <p className="page-subtitle" style={{ marginBottom: 14 }}>
              📅 {new Date(r.data_hora).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => convidar(r)}>Convidar</button>
              <button className="btn btn-gold" style={{ flex: 1 }} onClick={() => window.open(r.link_meet, "_blank")}>
                Entrar na roda
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}

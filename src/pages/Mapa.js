// ATENÇÃO — como checkins guarda texto livre (não nota numérica), o "radar"
// aqui é uma contagem de quantos check-ins tiveram cada eixo preenchido nos
// últimos 30 dias, não um gráfico com biblioteca externa (evita dependência
// nova no projeto). Dá pra evoluir pra um gráfico de verdade depois.
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import NavAcoes from "../components/NavAcoes";
import PremiumGate from "../components/PremiumGate";

export default function Mapa() {
  const { perfil, isPremium } = useAuth();
  const [contagens, setContagens] = useState({ corpo: 0, alma: 0, espirito: 0 });
  const [totalCheckins, setTotalCheckins] = useState(0);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const trintaDiasAtras = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { data } = await supabase
        .from("checkins")
        .select("corpo, alma, espirito")
        .eq("usuario_id", perfil.id)
        .gte("criado_em", trintaDiasAtras);

      const c = { corpo: 0, alma: 0, espirito: 0 };
      (data || []).forEach((row) => {
        if (row.corpo?.trim()) c.corpo++;
        if (row.alma?.trim()) c.alma++;
        if (row.espirito?.trim()) c.espirito++;
      });
      setContagens(c);
      setTotalCheckins((data || []).length);
      setCarregando(false);
    }
    if (isPremium && perfil?.id) carregar();
    else setCarregando(false);
  }, [perfil, isPremium]);

  if (!isPremium) {
    return (
      <div className="page-content">
        <NavAcoes voltarPara="/evolucao" />
        <h2 className="page-title">Mapa Holos</h2>
        <PremiumGate titulo="Mapa Holos" descricao="seu retrato em Corpo, Alma e Espírito, liberado no Premium" />
      </div>
    );
  }

  return (
    <div className="page-content">
      <NavAcoes voltarPara="/evolucao" />
      <h2 className="page-title">Mapa Holos</h2>
      <p className="page-subtitle">seus últimos 30 dias, por eixo</p>

      {carregando ? (
        <p className="page-subtitle">Carregando...</p>
      ) : totalCheckins === 0 ? (
        <p className="page-subtitle">Ainda não há check-ins suficientes pra montar seu mapa.</p>
      ) : (
        <div className="card-gold">
          <div className="metrica-row">
            <span className="metrica-label">🫀 Corpo</span>
            <span className="metrica-valor">{contagens.corpo}/{totalCheckins}</span>
          </div>
          <div className="metrica-row">
            <span className="metrica-label">💛 Alma</span>
            <span className="metrica-valor">{contagens.alma}/{totalCheckins}</span>
          </div>
          <div className="metrica-row">
            <span className="metrica-label">✝️ Espírito</span>
            <span className="metrica-valor">{contagens.espirito}/{totalCheckins}</span>
          </div>
        </div>
      )}
    </div>
  );
}

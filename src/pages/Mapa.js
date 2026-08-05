// O Mapa mostra a MÉDIA das notas (1-5) que o usuário deu em cada eixo nos
// check-ins dos últimos 30 dias — não é um gráfico com biblioteca externa
// (evita dependência nova no projeto). Dá pra evoluir pra um gráfico de
// verdade depois.
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import NavAcoes from "../components/NavAcoes";
import PremiumGate from "../components/PremiumGate";

function hojeMenosDias(dias) {
  const d = new Date(Date.now() - dias * 24 * 60 * 60 * 1000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function media(lista) {
  const validos = lista.filter((n) => n != null);
  if (validos.length === 0) return null;
  return validos.reduce((a, b) => a + b, 0) / validos.length;
}

export default function Mapa() {
  const { perfil, isPremium } = useAuth();
  const [medias, setMedias] = useState({ corpo: null, alma: null, espirito: null });
  const [totalCheckins, setTotalCheckins] = useState(0);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const { data } = await supabase
        .from("checkins")
        .select("nota_corpo, nota_alma, nota_espirito")
        .eq("perfil_id", perfil.id)
        .gte("data", hojeMenosDias(30));

      const linhas = data || [];
      setMedias({
        corpo: media(linhas.map((r) => r.nota_corpo)),
        alma: media(linhas.map((r) => r.nota_alma)),
        espirito: media(linhas.map((r) => r.nota_espirito)),
      });
      setTotalCheckins(linhas.length);
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
      <p className="page-subtitle">média das suas notas nos últimos 30 dias ({totalCheckins} check-in{totalCheckins === 1 ? "" : "s"})</p>

      {carregando ? (
        <p className="page-subtitle">Carregando...</p>
      ) : totalCheckins === 0 ? (
        <p className="page-subtitle">Ainda não há check-ins suficientes pra montar seu mapa.</p>
      ) : (
        <div className="card-gold">
          <div className="metrica-row">
            <span className="metrica-label">🫀 Corpo</span>
            <span className="metrica-valor">{medias.corpo?.toFixed(1) ?? "—"}/5</span>
          </div>
          <div className="metrica-row">
            <span className="metrica-label">💛 Alma</span>
            <span className="metrica-valor">{medias.alma?.toFixed(1) ?? "—"}/5</span>
          </div>
          <div className="metrica-row">
            <span className="metrica-label">✝️ Espírito</span>
            <span className="metrica-valor">{medias.espirito?.toFixed(1) ?? "—"}/5</span>
          </div>
        </div>
      )}
    </div>
  );
}

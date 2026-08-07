// Radar (SVG puro, sem biblioteca nova) comparando a quinzena atual com a
// anterior — os eixos "abrem" mais pro lado que teve notas mais altas.
// Usa texto em vez de emoji nos rótulos: alguns emojis não renderizam em
// todo sistema operacional/fonte.
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
  if (validos.length === 0) return 0;
  return validos.reduce((a, b) => a + b, 0) / validos.length;
}

function mediasDoPeriodo(linhas) {
  return {
    corpo: media(linhas.map((r) => r.nota_corpo)),
    mente: media(linhas.map((r) => r.nota_mente)),
    consciencia: media(linhas.map((r) => r.nota_consciencia)),
  };
}

const EIXOS = [
  { chave: "corpo", label: "CORPO", angulo: -90 },
  { chave: "mente", label: "MENTE", angulo: 30 },
  { chave: "consciencia", label: "CONSCIÊNCIA", angulo: 150 },
];
const RAIO = 85;
const CENTRO = 120;

function ponto(angulo, valor) {
  const rad = (angulo * Math.PI) / 180;
  const r = (valor / 5) * RAIO;
  return [CENTRO + r * Math.cos(rad), CENTRO + r * Math.sin(rad)];
}

function poligono(medias) {
  return EIXOS.map((e) => ponto(e.angulo, medias[e.chave])).map((p) => p.join(",")).join(" ");
}

function RadarChart({ atual, anterior }) {
  const aneis = [1, 2, 3, 4, 5];
  return (
    <svg viewBox="0 0 240 240" style={{ width: "100%", maxWidth: 300, display: "block", margin: "0 auto" }}>
      {aneis.map((nivel) => {
        const pts = EIXOS.map((e) => ponto(e.angulo, nivel)).map((p) => p.join(",")).join(" ");
        return <polygon key={nivel} points={pts} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />;
      })}
      {EIXOS.map((e) => {
        const [x, y] = ponto(e.angulo, 5);
        return <line key={e.chave} x1={CENTRO} y1={CENTRO} x2={x} y2={y} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />;
      })}

      {anterior && (
        <polygon points={poligono(anterior)} fill="none" stroke="#7C8B99" strokeWidth="1.5" strokeDasharray="4,3" />
      )}
      <polygon points={poligono(atual)} fill="var(--gold)" fillOpacity="0.25" stroke="var(--gold)" strokeWidth="2" />
      {EIXOS.map((e) => {
        const [x, y] = ponto(e.angulo, atual[e.chave]);
        return <circle key={e.chave} cx={x} cy={y} r="3.5" fill="var(--gold)" />;
      })}

      {EIXOS.map((e) => {
        const [x, y] = ponto(e.angulo, 6.15);
        return (
          <text
            key={e.chave}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fontFamily="Cinzel, serif"
            letterSpacing="0.5"
            fill="var(--gold)"
          >
            {e.label}
          </text>
        );
      })}
    </svg>
  );
}

export default function Mapa() {
  const { perfil, isPremium } = useAuth();
  const [atual, setAtual] = useState({ corpo: 0, mente: 0, consciencia: 0 });
  const [anterior, setAnterior] = useState(null);
  const [totalCheckins, setTotalCheckins] = useState(0);
  const [insight, setInsight] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const { data } = await supabase
        .from("checkins")
        .select("nota_corpo, nota_mente, nota_consciencia, data")
        .eq("perfil_id", perfil.id)
        .gte("data", hojeMenosDias(30));

      const linhas = data || [];
      const quinzenaAtual = linhas.filter((r) => r.data >= hojeMenosDias(15));
      const quinzenaAnterior = linhas.filter((r) => r.data < hojeMenosDias(15));

      setAtual(mediasDoPeriodo(quinzenaAtual.length > 0 ? quinzenaAtual : linhas));
      setAnterior(quinzenaAnterior.length >= 2 ? mediasDoPeriodo(quinzenaAnterior) : null);
      setTotalCheckins(linhas.length);

      if (quinzenaAtual.length >= 2) {
        const m = mediasDoPeriodo(quinzenaAtual);
        const nomes = { corpo: "Corpo", mente: "Mente", consciencia: "Consciência" };
        const destaque = Object.entries(m).sort((a, b) => b[1] - a[1])[0][0];
        setInsight(`Nos últimos 15 dias, ${nomes[destaque]} foi o eixo com as notas mais altas pra você.`);
      } else {
        setInsight(null);
      }

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
        <PremiumGate titulo="Mapa Holos" descricao="seu retrato em Corpo, Mente e Consciência, liberado no Premium" />
      </div>
    );
  }

  return (
    <div className="page-content">
      <NavAcoes voltarPara="/evolucao" />
      <h2 className="page-title">Mapa Holos</h2>
      <p className="page-subtitle">seus últimos 30 dias ({totalCheckins} check-in{totalCheckins === 1 ? "" : "s"})</p>

      {carregando ? (
        <p className="page-subtitle">Carregando...</p>
      ) : totalCheckins === 0 ? (
        <p className="page-subtitle">Ainda não há check-ins suficientes pra montar seu mapa.</p>
      ) : (
        <div className="card-gold">
          <RadarChart atual={atual} anterior={anterior} />

          {anterior && (
            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 6, fontSize: 11 }}>
              <span style={{ color: "var(--gold)" }}>● esta quinzena</span>
              <span style={{ color: "#7C8B99" }}>┄ quinzena anterior</span>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 10 }}>
            <span className="metrica-label">Corpo {atual.corpo.toFixed(1)}</span>
            <span className="metrica-label">Mente {atual.mente.toFixed(1)}</span>
            <span className="metrica-label">Consciência {atual.consciencia.toFixed(1)}</span>
          </div>

          {insight && (
            <p className="page-subtitle" style={{ textAlign: "center", marginTop: 12, marginBottom: 0 }}>
              {insight}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";

const ITENS = [
  { to: "/calendario", titulo: "Calendário", desc: "veja tudo que você registrou", icone: "📅" },
  { to: "/mapa", titulo: "Mapa Holos", desc: "seu retrato em Corpo, Mente e Consciência", icone: "🧭" },
  { to: "/avaliacao", titulo: "Avaliação Evolutiva", desc: "devolutiva da equipe a cada 90 dias", icone: "📜" },
];

export default function Evolucao() {
  return (
    <div className="page-content">
      <h2 className="page-title">Evolução</h2>
      <p className="page-subtitle">acompanhe sua jornada</p>

      {ITENS.map((a) => (
        <Link
          key={a.to}
          to={a.to}
          className="pro-card"
          style={{ textDecoration: "none", color: "inherit", alignItems: "center" }}
        >
          <span style={{ fontSize: 22 }}>{a.icone}</span>
          <div style={{ flex: 1 }}>
            <p className="section-label" style={{ marginBottom: 2 }}>{a.titulo}</p>
            <p className="page-subtitle" style={{ margin: 0, fontSize: 12 }}>{a.desc}</p>
          </div>
          <span style={{ color: "var(--gold)" }}>›</span>
        </Link>
      ))}
    </div>
  );
}

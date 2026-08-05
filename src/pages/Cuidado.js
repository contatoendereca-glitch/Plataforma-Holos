import React from "react";
import { Link } from "react-router-dom";

const ITENS = [
  { to: "/checkin", titulo: "Check-in diário", desc: "como você está agora, nos 3 eixos", icone: "🫀" },
  { to: "/registro", titulo: "Registro rápido", desc: "Gratidão · Diário Holos", icone: "🙏" },
  { to: "/dor", titulo: "Eu Hoje", desc: "escolha uma dor pra cuidar", icone: "💛" },
];

export default function Cuidado() {
  return (
    <div className="page-content">
      <h2 className="page-title">Cuidado</h2>
      <p className="page-subtitle">o que você quer fazer agora?</p>

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

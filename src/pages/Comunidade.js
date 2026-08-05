import React from "react";
import { Link } from "react-router-dom";

const ITENS = [
  { to: "/rodas", titulo: "Rodas Holos", desc: "conversa em grupo, link liberado pela admin", icone: "🗣️", badge: "Premium" },
  { to: "/clube", titulo: "Clube Holos", desc: "livro do mês + grupo de leitura", icone: "📚", badge: "Premium" },
  { to: "/profissionais", titulo: "Profissionais", desc: "vitrine de quem pode te acompanhar", icone: "🧑‍⚕️", badge: null },
];

export default function Comunidade() {
  return (
    <div className="page-content">
      <h2 className="page-title">Comunidade</h2>
      <p className="page-subtitle">pessoas e conversas por perto</p>

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
          {a.badge && <span className="badge-premium">{a.badge}</span>}
        </Link>
      ))}
    </div>
  );
}

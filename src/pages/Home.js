import React from "react";
import { Link } from "react-router-dom";

const ATALHOS = [
  { to: "/registro", titulo: "Registro rápido", desc: "gratidão e diário holos", icone: "🙏" },
  { to: "/dor", titulo: "Eu Hoje", desc: "escolha uma dor pra cuidar", icone: "💛" },
  { to: "/calendario", titulo: "Calendário", desc: "veja tudo que você registrou", icone: "📅" },
  { to: "/rodas", titulo: "Rodas Holos", desc: "conversas em grupo", icone: "🗣️" },
  { to: "/clube", titulo: "Clube Holos", desc: "leitura em grupo", icone: "📚" },
  { to: "/store", titulo: "Holos Store", desc: "curadoria de parceiros", icone: "🛍️" },
];

export default function Home() {
  return (
    <div className="page-content">
      <h2 className="page-title">Seu espaço</h2>
      <p className="page-subtitle">de onde você quer partir agora?</p>

      <div className="home-grid">
        {ATALHOS.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="card"
            style={{ textAlign: "center", textDecoration: "none", color: "inherit" }}
          >
            <div style={{ fontSize: 26, marginBottom: 8 }}>{a.icone}</div>
            <p style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>{a.titulo}</p>
            <p className="page-subtitle" style={{ marginBottom: 0, fontSize: 11 }}>{a.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

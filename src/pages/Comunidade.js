import React from "react";
import { Link } from "react-router-dom";
import NavAcoes from "../components/NavAcoes";

export default function Comunidade() {
  return (
    <div className="page-content">
      <NavAcoes voltarPara="/" />
      <h2 className="page-title">Comunidade</h2>
      <p className="page-subtitle">rodas e clube de leitura</p>

      <Link to="/rodas" className="pro-card" style={{ textDecoration: "none", color: "inherit" }}>
        <span style={{ fontSize: 20 }}>🗣️</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 500, fontSize: 14 }}>Rodas Holos</p>
          <p className="page-subtitle" style={{ margin: 0, fontSize: 12 }}>conversa em grupo, link liberado pela admin</p>
        </div>
        <span className="badge-premium">Premium</span>
      </Link>

      <Link to="/clube" className="pro-card" style={{ textDecoration: "none", color: "inherit" }}>
        <span style={{ fontSize: 20 }}>📚</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 500, fontSize: 14 }}>Clube Holos</p>
          <p className="page-subtitle" style={{ margin: 0, fontSize: 12 }}>livro do mês + grupo de leitura</p>
        </div>
        <span className="badge-premium">Premium</span>
      </Link>
    </div>
  );
}

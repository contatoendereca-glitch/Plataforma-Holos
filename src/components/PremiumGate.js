// Reutilizável em qualquer conteúdo que só existe no plano Premium.
import React from "react";
import { Link } from "react-router-dom";

export default function PremiumGate({ titulo, descricao }) {
  return (
    <div className="locked-card">
      <p style={{ fontWeight: 600, marginBottom: 4 }}>🔒 {titulo}</p>
      <p className="page-subtitle" style={{ marginBottom: 12 }}>{descricao}</p>
      <Link className="btn btn-gold" to="/premium">
        Assinar Premium
      </Link>
    </div>
  );
}

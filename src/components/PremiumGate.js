// Reutilizável em qualquer conteúdo que só existe no plano Premium.
import React from "react";
import { Link } from "react-router-dom";

export default function PremiumGate({ titulo, descricao }) {
  return (
    <div className="locked-card">
      <label>🔒 {titulo}</label>
      <p className="sub" style={{ marginBottom: 12 }}>{descricao}</p>
      <Link className="btn" to="/premium">
        Assinar Premium
      </Link>
    </div>
  );
}

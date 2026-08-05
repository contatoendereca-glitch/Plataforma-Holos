import React from "react";
import { useNavigate, Link } from "react-router-dom";

export default function NavAcoes({ voltarPara }) {
  const navigate = useNavigate();
  return (
    <div className="nav-actions">
      <button className="btn-back" onClick={() => (voltarPara ? navigate(voltarPara) : navigate(-1))}>
        ‹ Voltar
      </button>
      <Link className="btn-home-link" to="/">
        ⌂ Início
      </Link>
    </div>
  );
}

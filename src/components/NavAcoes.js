// Usar só em telas que NÃO estão diretamente no BottomNav (ex: Dor, DorDetalhe).
// Telas que já estão no menu de baixo (Checkin, Home, Premium, Perfil, Reflexão)
// não precisam disso — é redundante com a navegação de baixo.
import React from "react";
import { useNavigate, Link } from "react-router-dom";

export default function NavAcoes({ voltarPara }) {
  const navigate = useNavigate();
  return (
    <div className="nav-actions">
      <button className="btn-back" onClick={() => (voltarPara ? navigate(voltarPara) : navigate(-1))}>
        ‹ Voltar
      </button>
      <Link className="btn-home-link" to="/home">
        ⌂ Início
      </Link>
    </div>
  );
}

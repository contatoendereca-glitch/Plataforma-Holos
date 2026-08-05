import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import NavAcoes from "../components/NavAcoes";

export default function Dor() {
  const [dores, setDores] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const { data, error } = await supabase.from("dores").select("id, nome, icone");
      if (!error) setDores(data || []);
      setCarregando(false);
    }
    carregar();
  }, []);

  return (
    <div className="page-content">
      <NavAcoes voltarPara="/cuidado" />
      <h2 className="page-title">Eu Hoje</h2>
      <p className="page-subtitle">com o que você quer cuidar agora?</p>

      {carregando && <p className="page-subtitle">Carregando...</p>}
      {!carregando && dores.length === 0 && (
        <p className="page-subtitle">Nenhuma dor cadastrada ainda pelo Admin.</p>
      )}

      <div className="home-grid">
        {dores.map((d) => (
          <Link
            key={d.id}
            to={`/dor/${d.id}`}
            className="card"
            style={{ textAlign: "center", textDecoration: "none", color: "inherit" }}
          >
            <div style={{ fontSize: 22, marginBottom: 6 }}>{d.icone || "•"}</div>
            <p style={{ fontSize: 13 }}>{d.nome}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ATENÇÃO — assume colunas nome e icone (emoji, texto) na tabela dores.
// As dores em si só o Admin cadastra — até o Painel Admin existir, cadastre
// pelo SQL Editor ou pela Table Editor do Supabase. Sem nenhuma linha em
// `dores`, essa tela aparece vazia (mensagem já tratada abaixo).
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

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
    <div>
      <div className="topbar">
        <span onClick={() => window.history.back()}>‹ Voltar</span>
        <span onClick={() => (window.location.href = "/")}>⌂ Início</span>
      </div>

      <h1>Eu Hoje</h1>
      <p className="sub">com o que você quer cuidar agora?</p>

      {carregando && <p className="sub">Carregando...</p>}
      {!carregando && dores.length === 0 && (
        <p className="sub">Nenhuma dor cadastrada ainda pelo Admin.</p>
      )}

      <div className="dor-grid">
        {dores.map((d) => (
          <Link className="dor-item" to={`/dor/${d.id}`} key={d.id}>
            <span className="icon">{d.icone || "•"}</span>
            {d.nome}
          </Link>
        ))}
      </div>
    </div>
  );
}

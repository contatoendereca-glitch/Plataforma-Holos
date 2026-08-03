// ATENÇÃO — colunas assumidas em reflexoes_diarias: texto, audio_url, data_publicacao.
// Confira contra o schema real (holos_fase1_schema.sql) e ajuste os nomes se forem
// diferentes — sem isso a busca da reflexão de hoje não vai encontrar nada.
// A reflexão é conteúdo que só o Admin cadastra (não existe tela de cadastro do
// usuário aqui) — até o Painel Admin existir, insira as reflexões direto no
// SQL Editor do Supabase, uma por dia, com a data em data_publicacao.
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Home() {
  const [reflexao, setReflexao] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarReflexao() {
      const hoje = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from("reflexoes_diarias")
        .select("id, texto, audio_url")
        .eq("data_publicacao", hoje)
        .maybeSingle();
      if (!error) setReflexao(data);
      setCarregando(false);
    }
    carregarReflexao();
  }, []);

  function compartilhar() {
    if (!reflexao) return;
    const texto = encodeURIComponent(reflexao.texto);
    window.open(`https://wa.me/?text=${texto}`, "_blank");
  }

  return (
    <div>
      <div className="topbar">
        <span>&nbsp;</span>
        <span>⌂ Início</span>
      </div>

      <h1>Reflexão do dia</h1>
      <p className="sub">enviada pela equipe Holos</p>

      {carregando && <p className="sub">Carregando...</p>}
      {!carregando && !reflexao && (
        <p className="sub">Nenhuma reflexão publicada hoje ainda.</p>
      )}
      {reflexao && (
        <div className="card card-gold" style={{ marginBottom: 18 }}>
          <p>{reflexao.texto}</p>
          <div className="btn-row">
            <button className="btn btn-outline" onClick={compartilhar}>
              Compartilhar
            </button>
            {reflexao.audio_url && (
              <button
                className="btn btn-outline"
                onClick={() => window.open(reflexao.audio_url, "_blank")}
              >
                Ouvir
              </button>
            )}
          </div>
        </div>
      )}

      <Link className="homeblock" to="/registro">
        <div>
          <b>Registro rápido</b>
          <span className="desc">Gratidão · Diário Holos</span>
        </div>
        <span>›</span>
      </Link>
      <Link className="homeblock" to="/dor">
        <div>
          <b>Eu Hoje</b>
          <span className="desc">escolha uma dor pra cuidar</span>
        </div>
        <span>›</span>
      </Link>
      <Link className="homeblock" to="/calendario">
        <div>
          <b>Calendário</b>
          <span className="desc">veja tudo que você registrou</span>
        </div>
        <span>›</span>
      </Link>
      <Link className="homeblock" to="/store">
        <div>
          <b>Holos Store</b>
          <span className="desc">curadoria de produtos parceiros</span>
        </div>
        <span>›</span>
      </Link>
    </div>
  );
}

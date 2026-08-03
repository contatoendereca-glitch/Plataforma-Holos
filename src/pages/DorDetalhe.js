// ATENÇÃO — assume colunas em conteudos: titulo, eixo ('corpo'|'alma'|'espirito'),
// tipo ('audio'|'pdf'), link_externo, dor_id, profissional_id. Ajuste se o schema
// real usar outros nomes. Rota precisa ser registrada como /dor/:id no App.js.
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { usePerfil } from "../context/PerfilContext";
import PremiumGate from "../components/PremiumGate";

export default function DorDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { perfil } = usePerfil();
  const isPremium = perfil?.plano === "premium";

  const [conteudos, setConteudos] = useState([]);
  const [avaliados, setAvaliados] = useState({});
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const { data } = await supabase
        .from("conteudos")
        .select("id, titulo, eixo, tipo, link_externo")
        .eq("dor_id", id);
      setConteudos(data || []);

      if (perfil?.id) {
        const { data: minhas } = await supabase
          .from("avaliacoes_conteudo")
          .select("conteudo_id")
          .eq("usuario_id", perfil.id);
        const mapa = {};
        (minhas || []).forEach((a) => { mapa[a.conteudo_id] = true; });
        setAvaliados(mapa);
      }
      setCarregando(false);
    }
    carregar();
  }, [id, perfil]);

  async function marcarAjudou(conteudoId) {
    if (avaliados[conteudoId]) return;
    const { error } = await supabase
      .from("avaliacoes_conteudo")
      .insert({ conteudo_id: conteudoId, usuario_id: perfil.id });
    if (!error) setAvaliados((prev) => ({ ...prev, [conteudoId]: true }));
  }

  function abrirLink(url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function porEixo(eixo) {
    return conteudos.filter((c) => c.eixo === eixo);
  }

  function ListaConteudo({ eixo }) {
    const lista = porEixo(eixo);
    if (lista.length === 0) return <p className="sub">Nenhum conteúdo ainda.</p>;
    return lista.map((c) => (
      <div className="entry-row" key={c.id}>
        {c.titulo}
        <button className="btn-outline" onClick={() => abrirLink(c.link_externo)}>
          {c.tipo === "pdf" ? "Abrir" : "Ouvir"} ↗
        </button>
        {!avaliados[c.id] && (
          <button className="btn-outline" onClick={() => marcarAjudou(c.id)}>
            Isso me ajudou
          </button>
        )}
      </div>
    ));
  }

  return (
    <div>
      <div className="topbar">
        <span onClick={() => navigate("/dor")}>‹ Voltar</span>
        <span onClick={() => navigate("/")}>⌂ Início</span>
      </div>

      <h1>{carregando ? "Carregando..." : "Conteúdo"}</h1>
      <p className="sub">enviado pelos profissionais</p>

      {isPremium ? (
        <div className="card">
          <label>Corpo</label>
          <ListaConteudo eixo="corpo" />
        </div>
      ) : (
        <PremiumGate titulo="Corpo" descricao="conteúdo liberado no plano Premium" />
      )}

      <div className="card card-gold">
        <label>
          Alma <span className="badge">sempre liberado</span>
        </label>
        <ListaConteudo eixo="alma" />
      </div>

      {isPremium ? (
        <div className="card">
          <label>Espírito</label>
          <ListaConteudo eixo="espirito" />
        </div>
      ) : (
        <PremiumGate titulo="Espírito" descricao="conteúdo liberado no plano Premium" />
      )}
    </div>
  );
}

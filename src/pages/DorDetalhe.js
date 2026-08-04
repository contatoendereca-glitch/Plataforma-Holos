import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import NavAcoes from "../components/NavAcoes";

export default function DorDetalhe() {
  const { id } = useParams();
  const { perfil, isPremium } = useAuth();

  const [conteudos, setConteudos] = useState([]);
  const [avaliados, setAvaliados] = useState({});
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const { data, error } = await supabase
        .from("conteudos")
        .select("id, titulo, formato, url_externa, plano_minimo, descricao, instancias(nome)")
        .eq("dor_id", id)
        .eq("status", "Aprovado");

      if (error) console.error(error);
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

  function porEixo(nomeEixo) {
    return conteudos.filter((c) => c.instancias?.nome === nomeEixo);
  }

  function ItemConteudo({ c }) {
    const liberado = c.plano_minimo === "Gratuito" || isPremium;

    if (!liberado) {
      return (
        <div className="pro-card">
          <span style={{ fontSize: 18 }}>🔒</span>
          <div>
            <p style={{ fontWeight: 500, fontSize: 13 }}>{c.titulo}</p>
            <p className="page-subtitle" style={{ margin: 0, fontSize: 11 }}>disponível no Premium</p>
          </div>
        </div>
      );
    }

    return (
      <div className="pro-card">
        <span style={{ fontSize: 18 }}>{c.formato === "Audio" ? "🔊" : "📄"}</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 500, fontSize: 13, marginBottom: 4 }}>{c.titulo}</p>
          <button className="btn btn-outline btn-sm" onClick={() => abrirLink(c.url_externa)}>
            {c.formato === "Audio" ? "Ouvir" : "Ler"} ↗
          </button>
          {!avaliados[c.id] && (
            <button className="btn btn-outline btn-sm" style={{ marginLeft: 8 }} onClick={() => marcarAjudou(c.id)}>
              Isso me ajudou
            </button>
          )}
        </div>
      </div>
    );
  }

  function BlocoEixo({ nomeEixo, dourado }) {
    const lista = porEixo(nomeEixo);
    return (
      <div className={dourado ? "card-gold" : "card"}>
        <p className="section-label">
          {nomeEixo} {nomeEixo === "Alma" && <span className="badge-gratuito">sempre liberado</span>}
        </p>
        {lista.length === 0 ? (
          <p className="page-subtitle" style={{ margin: 0 }}>Nenhum conteúdo ainda.</p>
        ) : (
          lista.map((c) => <ItemConteudo c={c} key={c.id} />)
        )}
      </div>
    );
  }

  return (
    <div className="page-content">
      <NavAcoes voltarPara="/dor" />
      <h2 className="page-title">{carregando ? "Carregando..." : "Conteúdo"}</h2>
      <p className="page-subtitle">enviado pelos profissionais</p>

      <BlocoEixo nomeEixo="Corpo" />
      <BlocoEixo nomeEixo="Alma" dourado />
      <BlocoEixo nomeEixo="Espirito" />
    </div>
  );
}

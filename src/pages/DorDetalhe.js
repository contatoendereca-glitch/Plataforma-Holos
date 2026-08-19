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
  const [erroAjudou, setErroAjudou] = useState(null);
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
    setErroAjudou(null);
    const { error } = await supabase
      .from("avaliacoes_conteudo")
      .insert({ conteudo_id: conteudoId, usuario_id: perfil.id });
    if (error) {
      console.error(error);
      setErroAjudou(`Não foi possível registrar: ${error.message}`);
      return;
    }
    setAvaliados((prev) => ({ ...prev, [conteudoId]: true }));
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
      <div className="card" style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 18 }}>{c.formato === "Audio" ? "🔊" : "📄"}</span>
          <p style={{ fontWeight: 500, fontSize: 13, margin: 0, flex: 1 }}>{c.titulo}</p>
        </div>
        {c.descricao && (
          <p className="page-subtitle" style={{ fontSize: 12, marginBottom: 10 }}>{c.descricao}</p>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-gold btn-sm" style={{ flex: 1 }} onClick={() => abrirLink(c.url_externa)}>
            {c.formato === "Audio" ? "Ouvir" : "Ler"} ↗
          </button>
          {avaliados[c.id] ? (
            <span className="badge-gratuito" style={{ flex: 1, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
              💛 ajudou
            </span>
          ) : (
            <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => marcarAjudou(c.id)}>
              Isso me ajudou
            </button>
          )}
        </div>
      </div>
    );
  }

  function BlocoEixo({ nomeEixo, dourado }) {
    const lista = porEixo(nomeEixo);
    const label = nomeEixo === "Espirito" ? "Espírito" : nomeEixo;
    return (
      <div className={dourado ? "card-gold" : "card"} style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <p className="section-label" style={{ margin: 0 }}>{label}</p>
        </div>
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
      <p className="page-subtitle" style={{ marginBottom: 16 }}>enviado pelos profissionais</p>

      {erroAjudou && <p className="erro-msg">{erroAjudou}</p>}

      <BlocoEixo nomeEixo="Corpo" />
      <BlocoEixo nomeEixo="Alma" dourado />
      <BlocoEixo nomeEixo="Espirito" />
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import NavAcoes from "../components/NavAcoes";

const CATEGORIAS = [
  { chave: "livros", rotulo: "Livros" },
  { chave: "papelaria", rotulo: "Papelaria" },
  { chave: "eletronicos", rotulo: "Eletrônicos" },
  { chave: "ambiente", rotulo: "Ambiente" },
];

export default function Loja() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("livros");
  const [itens, setItens] = useState([]);
  const [destaques, setDestaques] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarDestaques() {
      const { data } = await supabase
        .from("loja_holos")
        .select("id, titulo, descricao, link_afiliado, imagem_url, destaque")
        .not("destaque", "is", null)
        .order("criado_em", { ascending: false });
      setDestaques(data || []);
    }
    carregarDestaques();
  }, []);

  useEffect(() => {
    async function carregarCategoria() {
      setCarregando(true);
      const { data } = await supabase
        .from("loja_holos")
        .select("id, titulo, descricao, link_afiliado, imagem_url")
        .eq("categoria", categoriaAtiva)
        .order("criado_em", { ascending: false });
      setItens(data || []);
      setCarregando(false);
    }
    carregarCategoria();
  }, [categoriaAtiva]);

  function abrirProduto(url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="page-content">
      <NavAcoes voltarPara="/" />
      <h2 className="page-title">Holos Store</h2>
      <p className="page-subtitle">curadoria por categoria, links de parceiros</p>

      {destaques.length > 0 && (
        <>
          <p className="section-label">Destaques</p>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", marginBottom: 18, paddingBottom: 4 }}>
            {destaques.map((d) => (
              <div
                className="pro-card"
                style={{ minWidth: 160, flexDirection: "column", alignItems: "flex-start", cursor: "pointer" }}
                key={d.id}
                onClick={() => abrirProduto(d.link_afiliado)}
              >
                <span className={d.destaque === "promocao" ? "badge-premium" : "badge-gratuito"}>
                  {d.destaque === "promocao" ? "Promoção" : "Novidade"}
                </span>
                {d.imagem_url && (
                  <img src={d.imagem_url} alt={d.titulo} style={{ width: "100%", borderRadius: 10, margin: "8px 0" }} />
                )}
                <p style={{ fontWeight: 500, fontSize: 13, marginBottom: 2 }}>{d.titulo}</p>
                <p className="page-subtitle" style={{ margin: 0, fontSize: 11 }}>{d.descricao}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="tabs">
        {CATEGORIAS.map((c) => (
          <button
            key={c.chave}
            className={`tab ${categoriaAtiva === c.chave ? "active" : ""}`}
            onClick={() => setCategoriaAtiva(c.chave)}
          >
            {c.rotulo}
          </button>
        ))}
      </div>

      {carregando && <p className="page-subtitle">Carregando...</p>}
      {!carregando && itens.length === 0 && (
        <p className="page-subtitle">Nenhum item nessa categoria ainda.</p>
      )}

      {itens.map((item) => (
        <div className="pro-card" style={{ cursor: "pointer" }} key={item.id} onClick={() => abrirProduto(item.link_afiliado)}>
          {item.imagem_url ? (
            <img src={item.imagem_url} alt={item.titulo} style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover" }} />
          ) : (
            <div style={{ width: 48, height: 48, borderRadius: 10, background: "var(--bg-card-soft)" }} />
          )}
          <div>
            <p style={{ fontWeight: 500, fontSize: 13, marginBottom: 2 }}>{item.titulo}</p>
            <p className="page-subtitle" style={{ margin: 0, fontSize: 11 }}>{item.descricao}</p>
          </div>
        </div>
      ))}

      <p className="page-subtitle" style={{ marginTop: 6 }}>
        imagem e link vêm de fora — nada é hospedado no Holos
      </p>
    </div>
  );
}

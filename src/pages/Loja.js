// Depende do patch_fase3_loja_holos.sql já aplicado. Itens só o Admin cadastra
// (loja_holos) — até o Painel Admin existir, cadastre pelo SQL Editor:
//   insert into loja_holos (titulo, descricao, categoria, link_afiliado, imagem_url, destaque)
//   values ('Nome do produto', 'descrição curta', 'livros', 'https://...',
//           'https://...jpg', 'promocao');
// categoria precisa ser uma de: livros, papelaria, eletronicos, ambiente.
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

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
    <div>
      <div className="topbar">
        <span onClick={() => window.history.back()}>‹ Voltar</span>
        <span onClick={() => (window.location.href = "/")}>⌂ Início</span>
      </div>

      <h1>Holos Store</h1>
      <p className="sub">curadoria por categoria, links de parceiros</p>

      {destaques.length > 0 && (
        <>
          <label>Destaques</label>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", marginBottom: 18, paddingBottom: 4 }}>
            {destaques.map((d) => (
              <div
                className="produto-card"
                style={{ minWidth: 150, flexDirection: "column", alignItems: "flex-start" }}
                key={d.id}
                onClick={() => abrirProduto(d.link_afiliado)}
              >
                <span className="badge">{d.destaque === "promocao" ? "Promoção" : "Novidade"}</span>
                {d.imagem_url && (
                  <img src={d.imagem_url} alt={d.titulo} style={{ width: "100%", borderRadius: 10, margin: "8px 0" }} />
                )}
                <div className="produto-info">
                  <b>{d.titulo}</b>
                  <span>{d.descricao}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="segment">
        {CATEGORIAS.map((c) => (
          <div
            key={c.chave}
            className={categoriaAtiva === c.chave ? "on" : ""}
            onClick={() => setCategoriaAtiva(c.chave)}
          >
            {c.rotulo}
          </div>
        ))}
      </div>

      {carregando && <p className="sub">Carregando...</p>}
      {!carregando && itens.length === 0 && (
        <p className="sub">Nenhum item nessa categoria ainda.</p>
      )}

      {itens.map((item) => (
        <div className="produto-card" key={item.id} onClick={() => abrirProduto(item.link_afiliado)}>
          {item.imagem_url ? (
            <img src={item.imagem_url} alt={item.titulo} className="produto-img" style={{ objectFit: "cover" }} />
          ) : (
            <div className="produto-img">•</div>
          )}
          <div className="produto-info">
            <b>{item.titulo}</b>
            <span>{item.descricao}</span>
          </div>
        </div>
      ))}

      <p className="sub" style={{ marginTop: 6 }}>
        imagem e link vêm de fora — nada é hospedado no Holos
      </p>
    </div>
  );
}

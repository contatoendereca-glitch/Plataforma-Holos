import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import NavAcoes from "../components/NavAcoes";

export default function Clube() {
  const { isPremium } = useAuth();
  const [livro, setLivro] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const hoje = new Date();
      const primeiroDiaMes = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-01`;
      const { data } = await supabase
        .from("clube_holos")
        .select("id, livro_titulo, livro_autor, link_grupo, descricao, data_encontro")
        .eq("mes_referencia", primeiroDiaMes)
        .maybeSingle();
      setLivro(data);
      setCarregando(false);
    }
    carregar();
  }, []);

  function convidar() {
    if (!livro) return
    const mensagem = `📚 Este mês no Clube Holos: "${livro.livro_titulo}", de ${livro.livro_autor}.\n\nBora ler junto?\n📲 https://plataforma-holos.vercel.app`
    window.open(`https://wa.me/?text=${encodeURIComponent(mensagem)}`, "_blank")
  }

  return (
    <div className="page-content">
      <NavAcoes voltarPara="/comunidade" />
      <h2 className="page-title">Clube Holos</h2>
      <p className="page-subtitle">leitura em grupo, o convite é livre pra todo mundo</p>

      {carregando && <p className="page-subtitle">Carregando...</p>}
      {!carregando && !livro && (
        <p className="page-subtitle">Nenhum livro cadastrado pro mês ainda.</p>
      )}

      {livro && (
        <div className="card-gold">
          <p style={{ fontWeight: 500, fontSize: 15, marginBottom: 2 }}>{livro.livro_titulo}</p>
          <p className="page-subtitle" style={{ marginBottom: 8 }}>{livro.livro_autor}</p>
          {livro.descricao && <p style={{ fontSize: 13, marginBottom: 8 }}>{livro.descricao}</p>}
          {livro.data_encontro && (
            <p className="page-subtitle" style={{ fontSize: 12, marginBottom: 14 }}>
              📅 Encontro em {new Date(livro.data_encontro).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
            </p>
          )}

          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-outline" style={{ flex: 1 }} onClick={convidar}>Convidar</button>
            {isPremium ? (
              <button className="btn btn-gold" style={{ flex: 1 }} onClick={() => window.open(livro.link_grupo, "_blank")}>
                Entrar no grupo
              </button>
            ) : (
              <button className="btn btn-outline" style={{ flex: 1, opacity: 0.6 }} disabled>
                🔒 Premium
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

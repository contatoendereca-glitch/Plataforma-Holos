import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import NavAcoes from "../components/NavAcoes";
import PremiumGate from "../components/PremiumGate";

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
        .select("id, livro_titulo, livro_autor, link_grupo, descricao")
        .eq("mes_referencia", primeiroDiaMes)
        .maybeSingle();
      setLivro(data);
      setCarregando(false);
    }
    if (isPremium) carregar();
    else setCarregando(false);
  }, [isPremium]);

  return (
    <div className="page-content">
      <NavAcoes voltarPara="/home" />
      <h2 className="page-title">Clube Holos</h2>
      <p className="page-subtitle">leitura em grupo</p>

      {!isPremium && (
        <PremiumGate titulo="Clube Holos" descricao="leitura em grupo, liberada no Premium" />
      )}

      {isPremium && carregando && <p className="page-subtitle">Carregando...</p>}
      {isPremium && !carregando && !livro && (
        <p className="page-subtitle">Nenhum livro cadastrado pro mês ainda.</p>
      )}

      {isPremium && livro && (
        <div className="card-gold">
          <p style={{ fontWeight: 500 }}>{livro.livro_titulo}</p>
          <p className="page-subtitle">{livro.livro_autor}</p>
          {livro.descricao && <p style={{ fontSize: 13 }}>{livro.descricao}</p>}
          <button className="btn btn-gold" onClick={() => window.open(livro.link_grupo, "_blank")}>
            Entrar no grupo de leitura
          </button>
        </div>
      )}
    </div>
  );
}

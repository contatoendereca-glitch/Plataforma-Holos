// Livro do mês + link do grupo — cadastrado pelo Admin (clube_holos).
// Até o Painel Admin existir, cadastre pelo SQL Editor:
//   insert into clube_holos (livro_titulo, livro_autor, mes_referencia, link_grupo, descricao)
//   values ('O Corpo Guarda as Marcas', 'Bessel van der Kolk', '2026-08-01',
//           'https://chat.whatsapp.com/...', null);
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { usePerfil } from "../context/PerfilContext";
import PremiumGate from "../components/PremiumGate";

export default function Clube() {
  const { perfil } = usePerfil();
  const isPremium = perfil?.plano === "premium";
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

  if (!isPremium) {
    return (
      <div>
        <div className="topbar">
          <span onClick={() => window.history.back()}>‹ Voltar</span>
          <span onClick={() => (window.location.href = "/")}>⌂ Início</span>
        </div>
        <h1>Clube Holos</h1>
        <PremiumGate titulo="Clube Holos" descricao="leitura em grupo, liberada no Premium" />
      </div>
    );
  }

  return (
    <div>
      <div className="topbar">
        <span onClick={() => window.history.back()}>‹ Voltar</span>
        <span onClick={() => (window.location.href = "/")}>⌂ Início</span>
      </div>

      <h1>Clube Holos</h1>
      <p className="sub">leitura em grupo</p>

      {carregando && <p className="sub">Carregando...</p>}
      {!carregando && !livro && (
        <p className="sub">Nenhum livro cadastrado pro mês ainda.</p>
      )}

      {livro && (
        <div className="card card-gold">
          <label>{livro.livro_titulo}</label>
          <p className="sub">{livro.livro_autor}</p>
          {livro.descricao && <p>{livro.descricao}</p>}
          <button className="btn" onClick={() => window.open(livro.link_grupo, "_blank")}>
            Entrar no grupo de leitura
          </button>
        </div>
      )}
    </div>
  );
}

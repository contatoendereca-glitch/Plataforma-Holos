// ATENÇÃO — assume que perfis tem uma coluna papel com o valor
// 'profissional' pra identificar quem entra na vitrine (mesmo padrão
// usado por is_admin() pra identificar administradores). Ajuste o valor
// se o schema real usar outro nome/valor.
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import NavAcoes from "../components/NavAcoes";

export default function Profissionais() {
  const { perfil, isPremium } = useAuth();
  const [profissionais, setProfissionais] = useState([]);
  const [solicitados, setSolicitados] = useState({});
  const [matchesEsteMs, setMatchesEsteMes] = useState(0);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const { data } = await supabase
        .from("perfis")
        .select("id, nome, pontos_ajudou")
 .eq("papel", "Profissional")
        .order("pontos_ajudou", { ascending: false });
      setProfissionais(data || []);

      const primeiroDiaMes = new Date();
      primeiroDiaMes.setDate(1);
      primeiroDiaMes.setHours(0, 0, 0, 0);

      const { data: meusMatches } = await supabase
        .from("matches")
        .select("id, profissional_id, criado_em")
        .eq("usuario_id", perfil.id)
        .gte("criado_em", primeiroDiaMes.toISOString());

      const mapa = {};
      (meusMatches || []).forEach((m) => { mapa[m.profissional_id] = true; });
      setSolicitados(mapa);
      setMatchesEsteMes((meusMatches || []).length);
      setCarregando(false);
    }
    if (perfil?.id) carregar();
  }, [perfil]);

  async function solicitarMatch(profissionalId) {
    if (!isPremium && matchesEsteMs >= 1) {
      alert("Seu plano Grátis permite 1 solicitação de match por mês. Assine o Premium pra ter matches ilimitados.");
      return;
    }
    const { error } = await supabase.from("matches").insert({
      usuario_id: perfil.id,
      profissional_id: profissionalId,
    });
    if (!error) {
      setSolicitados((prev) => ({ ...prev, [profissionalId]: true }));
      setMatchesEsteMes((n) => n + 1);
    }
  }

  return (
    <div className="page-content">
      <NavAcoes voltarPara="/comunidade" />
      <h2 className="page-title">Profissionais</h2>
      <p className="page-subtitle">
        {isPremium ? "matches ilimitados no seu plano" : `você tem ${1 - matchesEsteMs > 0 ? 1 - matchesEsteMs : 0} match grátis disponível este mês`}
      </p>

      {carregando && <p className="page-subtitle">Carregando...</p>}
      {!carregando && profissionais.length === 0 && (
        <p className="page-subtitle">Nenhum profissional cadastrado ainda.</p>
      )}

      {profissionais.map((p) => (
        <div className="pro-card" key={p.id}>
          <div className="avatar">{(p.nome || "?").slice(0, 2).toUpperCase()}</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 500, fontSize: 14 }}>{p.nome}</p>
            <p className="page-subtitle" style={{ margin: 0, fontSize: 12 }}>
              {"⭐".repeat(Math.min(5, Math.max(1, Math.ceil((p.pontos_ajudou || 0) / 5))))}
            </p>
          </div>
          {solicitados[p.id] ? (
            <span className="badge-gratuito">solicitado</span>
          ) : (
            <button className="btn btn-outline btn-sm" onClick={() => solicitarMatch(p.id)}>
              Solicitar match
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

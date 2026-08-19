import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import NavAcoes from "../components/NavAcoes";
import { calcularSelo } from "../lib/selos";

export default function Profissionais() {
  const { perfil, isPremium } = useAuth();
  const [profissionais, setProfissionais] = useState([]);
  const [conteudosPorProfissional, setConteudosPorProfissional] = useState({});
  const [meusMatches, setMeusMatches] = useState({}); // profissional_id -> match row
  const [matchesEsteMes, setMatchesEsteMes] = useState(0);
  const [carregando, setCarregando] = useState(true);

  async function carregar() {
    const { data } = await supabase
      .from("perfis")
      .select("id, nome, pontos_ajudou")
      .eq("papel", "Profissional")
      .eq("suspenso", false)
      .order("pontos_ajudou", { ascending: false });

    const { data: conteudosAprovados } = await supabase
      .from("conteudos")
      .select("autor_id")
      .eq("status", "Aprovado");

    const contagem = {};
    (conteudosAprovados || []).forEach((c) => {
      contagem[c.autor_id] = (contagem[c.autor_id] || 0) + 1;
    });
    setConteudosPorProfissional(contagem);

    const ordenados = [...(data || [])].sort((a, b) => {
      const seloA = calcularSelo(contagem[a.id] || 0, a.pontos_ajudou || 0);
      const seloB = calcularSelo(contagem[b.id] || 0, b.pontos_ajudou || 0);
      const nivelA = seloA?.nivel || 0;
      const nivelB = seloB?.nivel || 0;
      if (nivelB !== nivelA) return nivelB - nivelA;
      return (b.pontos_ajudou || 0) - (a.pontos_ajudou || 0);
    });
    setProfissionais(ordenados);

    const primeiroDiaMes = new Date();
    primeiroDiaMes.setDate(1);
    primeiroDiaMes.setHours(0, 0, 0, 0);

    const { data: matches } = await supabase
      .from("matches")
      .select("id, profissional_id, ajudou, criado_em, status")
      .eq("usuario_id", perfil.id);

    const mapa = {};
    (matches || []).forEach((m) => { mapa[m.profissional_id] = m; });
    setMeusMatches(mapa);

    const doMes = (matches || []).filter((m) => new Date(m.criado_em) >= primeiroDiaMes);
    setMatchesEsteMes(doMes.length);
    setCarregando(false);
  }

  useEffect(() => {
    if (perfil?.id) carregar();
  }, [perfil]);

  async function solicitarMatch(profissionalId) {
    if (!isPremium && matchesEsteMes >= 1) {
      alert("Seu plano Grátis permite 1 solicitação de match por mês. Assine o Premium pra ter matches ilimitados.");
      return;
    }
    const { error } = await supabase.from("matches").insert({
      usuario_id: perfil.id,
      profissional_id: profissionalId,
    });
    if (!error) carregar();
  }

  async function confirmarInteresse(match) {
    await supabase.from("matches").update({ status: "confirmado" }).eq("id", match.id);
    carregar();
  }

  async function marcarAjudou(match) {
    const { error: err1 } = await supabase.from("matches").update({ ajudou: true }).eq("id", match.id);
    if (err1) return;

    const profissional = profissionais.find((p) => p.id === match.profissional_id);
    const novoTotal = (profissional?.pontos_ajudou || 0) + 1;
    await supabase.from("perfis").update({ pontos_ajudou: novoTotal }).eq("id", match.profissional_id);
    carregar();
  }

  return (
    <div className="page-content">
      <NavAcoes voltarPara="/comunidade" />
      <h2 className="page-title">Profissionais</h2>
      <p className="page-subtitle">
        {isPremium ? "matches ilimitados no seu plano" : `você tem ${1 - matchesEsteMes > 0 ? 1 - matchesEsteMes : 0} match grátis disponível este mês`}
      </p>

      {carregando && <p className="page-subtitle">Carregando...</p>}
      {!carregando && profissionais.length === 0 && (
        <p className="page-subtitle">Nenhum profissional cadastrado ainda.</p>
      )}

      {profissionais.map((p) => {
        const meuMatch = meusMatches[p.id];
        const selo = calcularSelo(conteudosPorProfissional[p.id] || 0, p.pontos_ajudou || 0);
        return (
          <div className="pro-card" key={p.id} style={{ flexWrap: "wrap" }}>
            <div className="avatar">{(p.nome || "?").slice(0, 2).toUpperCase()}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 500, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                {p.nome}
                {selo && <span className="badge-premium" style={{ fontSize: 10 }}>{selo.nome}</span>}
              </p>
              <p className="page-subtitle" style={{ margin: 0, fontSize: 12 }}>
                {"⭐".repeat(Math.min(5, Math.max(1, Math.ceil((p.pontos_ajudou || 0) / 5))))}
                {" "}
                <span style={{ opacity: 0.6 }}>({p.pontos_ajudou || 0})</span>
              </p>
            </div>

            {!meuMatch && (
              <button className="btn btn-outline btn-sm" onClick={() => solicitarMatch(p.id)}>
                Solicitar match
              </button>
            )}
            {meuMatch && meuMatch.status === "pendente" && (
              <span className="badge-gratuito" style={{ fontSize: 11 }}>⏳ aguardando aprovação</span>
            )}
            {meuMatch && meuMatch.status === "aprovado" && (
              <button className="btn btn-gold btn-sm" onClick={() => confirmarInteresse(meuMatch)}>
                Confirmar interesse
              </button>
            )}
            {meuMatch && meuMatch.status === "confirmado" && (
              <span className="badge-gratuito" style={{ fontSize: 11 }}>📩 aguardando boleto</span>
            )}
            {meuMatch && meuMatch.status === "aguardando_pagamento" && (
              <span className="badge-gratuito" style={{ fontSize: 11 }}>💳 aguardando confirmação de pagamento</span>
            )}
            {meuMatch && meuMatch.status === "pago" && !meuMatch.ajudou && (
              <button className="btn btn-outline btn-sm" onClick={() => marcarAjudou(meuMatch)}>
                🤍 Isso me ajudou
              </button>
            )}
            {meuMatch && meuMatch.status === "pago" && meuMatch.ajudou && (
              <span className="badge-gratuito">💛 você marcou que ajudou</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

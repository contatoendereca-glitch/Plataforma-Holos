// ATENÇÃO — assume colunas: perfis.nome, perfis.email; assinaturas.status,
// assinaturas.plano, assinaturas.data_fim. Ajuste os nomes se o schema real
// usar outros. Sem foto de perfil de propósito — avatar é sempre por iniciais,
// pra não gerar custo de storage no Supabase free tier.
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { usePerfil } from "../context/PerfilContext";

function iniciais(nome) {
  if (!nome) return "?";
  const partes = nome.trim().split(" ");
  const primeira = partes[0]?.[0] || "";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}

export default function Perfil() {
  const { perfil } = usePerfil();
  const [assinatura, setAssinatura] = useState(null);
  const [stats, setStats] = useState({ checkins: 0, gratidoes: 0, diario: 0 });
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState(perfil?.nome || "");

  useEffect(() => {
    async function carregar() {
      const { data: assin } = await supabase
        .from("assinaturas")
        .select("status, plano, data_fim")
        .eq("usuario_id", perfil.id)
        .eq("status", "ativa")
        .maybeSingle();
      setAssinatura(assin);

      const [checkins, gratidoes, diario] = await Promise.all([
        supabase.from("checkins").select("id", { count: "exact", head: true }).eq("usuario_id", perfil.id),
        supabase.from("gratidoes").select("id", { count: "exact", head: true }).eq("usuario_id", perfil.id),
        supabase.from("diario_holos").select("id", { count: "exact", head: true }).eq("usuario_id", perfil.id),
      ]);
      setStats({
        checkins: checkins.count || 0,
        gratidoes: gratidoes.count || 0,
        diario: diario.count || 0,
      });
    }
    if (perfil?.id) carregar();
  }, [perfil]);

  async function salvarNome() {
    const { error } = await supabase.from("perfis").update({ nome }).eq("id", perfil.id);
    if (!error) setEditando(false);
  }

  async function compartilharApp() {
    const url = "https://plataforma-holos.vercel.app";
    if (navigator.share) {
      navigator.share({ title: "Plataforma Holos", text: "Dá uma olhada no Holos", url });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copiado.");
    }
  }

  async function sair() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div>
      <div className="topbar">
        <span onClick={() => window.history.back()}>‹ Voltar</span>
        <span onClick={() => (window.location.href = "/")}>⌂ Início</span>
      </div>

      <h1>Perfil</h1>

      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <div className="avatar">{iniciais(perfil?.nome)}</div>
        {editando ? (
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
            <input value={nome} onChange={(e) => setNome(e.target.value)} style={{ maxWidth: 180 }} />
            <button className="btn-outline" onClick={salvarNome}>Salvar</button>
          </div>
        ) : (
          <p style={{ fontFamily: "Cinzel, serif", fontSize: 14, margin: 0 }}>{perfil?.nome}</p>
        )}
      </div>

      <div className="stats-row">
        <div className="stat"><b>{stats.checkins}</b><span>check-ins</span></div>
        <div className="stat"><b>{stats.gratidoes}</b><span>gratidões</span></div>
        <div className="stat"><b>{stats.diario}</b><span>diário</span></div>
      </div>

      <div className="card card-gold">
        <label>Plano atual</label>
        {assinatura ? (
          <p>
            {assinatura.plano === "premium" ? "Premium" : "Grátis"}{" "}
            {assinatura.data_fim && (
              <span className="badge">
                ativo até {new Date(assinatura.data_fim).toLocaleDateString("pt-BR")}
              </span>
            )}
          </p>
        ) : (
          <p>Grátis</p>
        )}
      </div>

      <div className="homeblock" onClick={() => setEditando(true)}>
        <div><b>Editar dados</b><span className="desc">nome</span></div><span>›</span>
      </div>
      <div className="homeblock" onClick={compartilharApp}>
        <div><b>Compartilhar aplicativo</b><span className="desc">indique o Holos pra alguém</span></div><span>›</span>
      </div>

      <button className="btn btn-outline" onClick={sair}>Sair</button>
    </div>
  );
}

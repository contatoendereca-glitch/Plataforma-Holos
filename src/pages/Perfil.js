import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

function iniciais(nome) {
  if (!nome) return "?";
  const partes = nome.trim().split(" ");
  const primeira = partes[0]?.[0] || "";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}

export default function Perfil() {
  const { perfil, isPremium, sair, carregarPerfil } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ checkins: 0, gratidoes: 0, diario: 0 });
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState(perfil?.nome || "");

  useEffect(() => {
    async function carregar() {
      const [checkins, gratidoes, diario] = await Promise.all([
        supabase.from("checkins").select("id", { count: "exact", head: true }).eq("perfil_id", perfil.id),
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
    if (!error) {
      setEditando(false);
      carregarPerfil(perfil.id);
    }
  }

  function compartilharApp() {
    const mensagem = `Tô usando a Plataforma Holos pra cuidar de mim em Corpo, Alma e Espírito. Bora comigo?\n\n📲 https://plataforma-holos.vercel.app`;
    window.open(`https://wa.me/?text=${encodeURIComponent(mensagem)}`, "_blank");
  }

  return (
    <div className="page-content">
      <h2 className="page-title">Perfil</h2>

      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div className="avatar" style={{ margin: "0 auto 8px" }}>{iniciais(perfil?.nome)}</div>
        {editando ? (
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
            <input className="input" value={nome} onChange={(e) => setNome(e.target.value)} style={{ maxWidth: 180 }} />
            <button className="btn btn-outline btn-sm" onClick={salvarNome}>Salvar</button>
          </div>
        ) : (
          <>
            <p style={{ fontFamily: "Cinzel, serif", fontSize: 15, marginBottom: 4 }}>{perfil?.nome}</p>
            {isPremium && <span className="badge-premium">👑 Premium</span>}
          </>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <div className="card" style={{ flex: 1, textAlign: "center" }}>
          <p style={{ fontFamily: "Cinzel, serif", color: "var(--gold)", fontSize: 18 }}>{stats.checkins}</p>
          <p className="page-subtitle" style={{ margin: 0, fontSize: 10 }}>check-ins</p>
        </div>
        <div className="card" style={{ flex: 1, textAlign: "center" }}>
          <p style={{ fontFamily: "Cinzel, serif", color: "var(--gold)", fontSize: 18 }}>{stats.gratidoes}</p>
          <p className="page-subtitle" style={{ margin: 0, fontSize: 10 }}>gratidões</p>
        </div>
        <div className="card" style={{ flex: 1, textAlign: "center" }}>
          <p style={{ fontFamily: "Cinzel, serif", color: "var(--gold)", fontSize: 18 }}>{stats.diario}</p>
          <p className="page-subtitle" style={{ margin: 0, fontSize: 10 }}>diário</p>
        </div>
      </div>

      <div className="divider" />

      {perfil?.papel === "Profissional" && (
        <div className="metrica-row" style={{ cursor: "pointer" }} onClick={() => navigate("/painel-profissional")}>
          <span className="metrica-label">📋 Meu painel profissional</span>
          <span className="metrica-valor">›</span>
        </div>
      )}

      <div className="metrica-row" style={{ cursor: "pointer" }} onClick={() => setEditando(true)}>
        <span className="metrica-label">Editar nome</span>
        <span className="metrica-valor">›</span>
      </div>
      <div className="metrica-row" style={{ cursor: "pointer" }} onClick={compartilharApp}>
        <span className="metrica-label">Compartilhar aplicativo</span>
        <span className="metrica-valor">›</span>
      </div>

      <button className="btn btn-outline" style={{ marginTop: 20 }} onClick={sair}>
        Sair
      </button>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import NavAcoes from "../components/NavAcoes";
import PremiumGate from "../components/PremiumGate";

export default function Avaliacao() {
  const { perfil, isPremium } = useAuth();
  const [avaliacao, setAvaliacao] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const { data } = await supabase
        .from("avaliacoes_evolutivas")
        .select("texto, entregue_em")
        .eq("usuario_id", perfil.id)
        .order("entregue_em", { ascending: false })
        .limit(1)
        .maybeSingle();
      setAvaliacao(data);
      setCarregando(false);
    }
    if (isPremium && perfil?.id) carregar();
    else setCarregando(false);
  }, [perfil, isPremium]);

  if (!isPremium) {
    return (
      <div className="page-content">
        <NavAcoes voltarPara="/evolucao" />
        <h2 className="page-title">Avaliação Evolutiva</h2>
        <PremiumGate titulo="Avaliação Evolutiva" descricao="devolutiva da equipe a cada 90 dias, liberada no Premium" />
      </div>
    );
  }

  return (
    <div className="page-content">
      <NavAcoes voltarPara="/evolucao" />
      <h2 className="page-title">Avaliação Evolutiva</h2>
      <p className="page-subtitle">devolutiva escrita pela equipe Holos</p>

      {carregando && <p className="page-subtitle">Carregando...</p>}

      {!carregando && !avaliacao && (
        <div className="card">
          <p>Sua primeira devolutiva chega depois de 90 dias de jornada — a equipe escreve pessoalmente, não é gerada automaticamente.</p>
        </div>
      )}

      {avaliacao && (
        <div className="card-gold">
          <p className="page-subtitle">
            entregue em {new Date(avaliacao.entregue_em).toLocaleDateString("pt-BR")}
          </p>
          <p>{avaliacao.texto}</p>
        </div>
      )}
    </div>
  );
}

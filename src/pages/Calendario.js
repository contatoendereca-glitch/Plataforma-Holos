import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import NavAcoes from "../components/NavAcoes";

function inicioFimDoMes(data) {
  const inicio = new Date(data.getFullYear(), data.getMonth(), 1);
  const fim = new Date(data.getFullYear(), data.getMonth() + 1, 0, 23, 59, 59);
  return { inicio, fim };
}

export default function Calendario() {
  const { perfil } = useAuth();
  const navigate = useNavigate();
  const [mesRef] = useState(new Date());
  const [diaSelecionado, setDiaSelecionado] = useState(new Date().getDate());
  const [entradasPorDia, setEntradasPorDia] = useState({});
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      const { inicio, fim } = inicioFimDoMes(mesRef);
      const isoInicio = inicio.toISOString();
      const isoFim = fim.toISOString();

      const [checkins, gratidoes, diario] = await Promise.all([
        supabase.from("checkins").select("id, criado_em").eq("usuario_id", perfil.id).gte("criado_em", isoInicio).lte("criado_em", isoFim),
        supabase.from("gratidoes").select("id, criado_em").eq("usuario_id", perfil.id).gte("criado_em", isoInicio).lte("criado_em", isoFim),
        supabase.from("diario_holos").select("id, criado_em").eq("usuario_id", perfil.id).gte("criado_em", isoInicio).lte("criado_em", isoFim),
      ]);

      const mapa = {};
      function registrar(lista, tipo) {
        (lista.data || []).forEach((item) => {
          const dia = new Date(item.criado_em).getDate();
          if (!mapa[dia]) mapa[dia] = [];
          mapa[dia].push(tipo);
        });
      }
      registrar(checkins, "checkin");
      registrar(gratidoes, "gratidao");
      registrar(diario, "diario");

      setEntradasPorDia(mapa);
      setCarregando(false);
    }
    if (perfil?.id) carregar();
  }, [perfil, mesRef]);

  const diasDoMes = useMemo(() => inicioFimDoMes(mesRef).fim.getDate(), [mesRef]);

  const INFO_TIPO = {
    checkin: { icone: "🫀", label: "Check-in — Corpo, Alma, Espírito", rota: "/checkin" },
    gratidao: { icone: "🙏", label: "Gratidão registrada", rota: "/registro" },
    diario: { icone: "✝️", label: "Diário Holos — registro", rota: "/registro" },
  };

  const entradasDoDia = entradasPorDia[diaSelecionado] || [];

  return (
    <div className="page-content">
      <NavAcoes voltarPara="/evolucao" />
      <h2 className="page-title">Calendário</h2>
      <p className="page-subtitle">
        {mesRef.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
      </p>

      {carregando ? (
        <p className="page-subtitle">Carregando...</p>
      ) : (
        <>
          <div className="calendario-grid" style={{ marginBottom: 16 }}>
            {Array.from({ length: diasDoMes }, (_, i) => i + 1).map((dia) => {
              const qtd = (entradasPorDia[dia] || []).length;
              const classe = qtd === 0 ? "dia-vazio" : qtd >= 3 ? "dia-completo" : "dia-parcial";
              return (
                <div
                  key={dia}
                  className={`dia-check ${classe} ${dia === diaSelecionado ? "dia-hoje" : ""}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setDiaSelecionado(dia)}
                >
                  {dia}
                </div>
              );
            })}
          </div>

          <div className="card-gold">
            <p className="section-label">Dia {diaSelecionado} — o que você registrou</p>
            {entradasDoDia.length === 0 ? (
              <p className="page-subtitle" style={{ margin: 0 }}>Nenhum registro nesse dia.</p>
            ) : (
              entradasDoDia.map((tipo, i) => {
                const info = INFO_TIPO[tipo];
                return (
                  <div
                    key={i}
                    className="pro-card"
                    style={{ cursor: "pointer", marginBottom: 8 }}
                    onClick={() => navigate(info.rota)}
                  >
                    <span style={{ fontSize: 18 }}>{info.icone}</span>
                    <div style={{ flex: 1 }}>{info.label}</div>
                    <span style={{ color: "var(--gold)", fontSize: 12 }}>abrir ›</span>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}

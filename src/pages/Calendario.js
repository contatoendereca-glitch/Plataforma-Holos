import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import NavAcoes from "../components/NavAcoes";

const TIPOS = ["checkin", "gratidao", "diario"];

const INFO_TIPO = {
  checkin: { icone: "🫀", label: "Check-in", rota: "/checkin" },
  gratidao: { icone: "🙏", label: "Gratidão", rota: "/registro" },
  diario: { icone: "✝️", label: "Diário Holos", rota: "/registro" },
};

function inicioFimDoMes(data) {
  const inicio = new Date(data.getFullYear(), data.getMonth(), 1);
  const fim = new Date(data.getFullYear(), data.getMonth() + 1, 0, 23, 59, 59);
  return { inicio, fim };
}

function resumoEntrada(entrada) {
  if (entrada.tipo === "checkin") {
    return `🫀 ${entrada.nota_corpo} · 💛 ${entrada.nota_alma} · ✝️ ${entrada.nota_espirito}`;
  }
  if (entrada.tipo === "gratidao") {
    return [entrada.campo_1, entrada.campo_2, entrada.campo_3].filter(Boolean).join(" · ");
  }
  return entrada.titulo || (entrada.conteudo || "").slice(0, 60);
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
        supabase.from("checkins").select("id, nota_corpo, nota_alma, nota_espirito, criado_em").eq("perfil_id", perfil.id).gte("criado_em", isoInicio).lte("criado_em", isoFim),
        supabase.from("gratidoes").select("id, campo_1, campo_2, campo_3, criado_em").eq("usuario_id", perfil.id).gte("criado_em", isoInicio).lte("criado_em", isoFim),
        supabase.from("diario_holos").select("id, titulo, conteudo, criado_em").eq("usuario_id", perfil.id).gte("criado_em", isoInicio).lte("criado_em", isoFim),
      ]);

      const mapa = {};
      function registrar(lista, tipo) {
        (lista.data || []).forEach((item) => {
          const dia = new Date(item.criado_em).getDate();
          if (!mapa[dia]) mapa[dia] = [];
          mapa[dia].push({ tipo, ...item });
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
  const hoje = new Date();
  const ehMesAtual = hoje.getFullYear() === mesRef.getFullYear() && hoje.getMonth() === mesRef.getMonth();

  const entradasDoDia = entradasPorDia[diaSelecionado] || [];
  const tiposFeitos = new Set(entradasDoDia.map((e) => e.tipo));
  const tiposFaltando = TIPOS.filter((t) => !tiposFeitos.has(t));
  const ehHoje = ehMesAtual && diaSelecionado === hoje.getDate();

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
              const entradas = entradasPorDia[dia] || [];
              const feitos = new Set(entradas.map((e) => e.tipo));
              return (
                <div
                  key={dia}
                  className={`dia-check ${dia === diaSelecionado ? "dia-hoje" : ""}`}
                  style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}
                  onClick={() => setDiaSelecionado(dia)}
                >
                  <span>{dia}</span>
                  <div style={{ display: "flex", gap: 2 }}>
                    {TIPOS.map((tipo) => (
                      <span
                        key={tipo}
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: feitos.has(tipo) ? "var(--gold)" : "rgba(255,255,255,0.15)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card-gold" style={{ marginBottom: 16 }}>
            <p className="section-label">
              Dia {diaSelecionado} {ehHoje && <span className="badge-gratuito">hoje</span>} — o que você registrou
            </p>
            {entradasDoDia.length === 0 ? (
              <p className="page-subtitle" style={{ margin: 0 }}>Nenhum registro nesse dia.</p>
            ) : (
              entradasDoDia.map((entrada, i) => {
                const info = INFO_TIPO[entrada.tipo];
                return (
                  <div
                    key={i}
                    className="pro-card"
                    style={{ cursor: "pointer", marginBottom: 8 }}
                    onClick={() => navigate(info.rota)}
                  >
                    <span style={{ fontSize: 18 }}>{info.icone}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 500, fontSize: 13, marginBottom: 2 }}>{info.label}</p>
                      <p className="page-subtitle" style={{ margin: 0, fontSize: 12 }}>{resumoEntrada(entrada)}</p>
                    </div>
                    <span style={{ color: "var(--gold)", fontSize: 12 }}>abrir ›</span>
                  </div>
                );
              })
            )}
          </div>

          {tiposFaltando.length > 0 && (
            <div className="card">
              <p className="section-label">Ainda falta {ehHoje ? "hoje" : "nesse dia"}</p>
              {tiposFaltando.map((tipo) => {
                const info = INFO_TIPO[tipo];
                return (
                  <div
                    key={tipo}
                    className="pro-card"
                    style={{ cursor: "pointer", marginBottom: 8, opacity: 0.75 }}
                    onClick={() => navigate(info.rota)}
                  >
                    <span style={{ fontSize: 18 }}>{info.icone}</span>
                    <div style={{ flex: 1 }}>{info.label}</div>
                    <span style={{ color: "var(--gold)", fontSize: 12 }}>fazer ›</span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

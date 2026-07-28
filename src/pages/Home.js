import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { perfil, isPremium } = useAuth()
  const navigate = useNavigate()
  const [dores, setDores] = useState([])
  const [instancias, setInstancias] = useState([])
  const [conteudosPorInstancia, setConteudosPorInstancia] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => { carregar() }, [perfil])

  async function carregar() {
    const { data: dds } = await supabase.from('dores').select('*').eq('ativo', true).order('ordem')
    const { data: ins } = await supabase.from('instancias').select('*').order('ordem')
    setDores(dds || [])
    setInstancias(ins || [])

    const dorId = perfil?.dor_atual_id || dds?.[0]?.id
    if (dorId) {
      const { data: cont } = await supabase
        .from('conteudos')
        .select('*')
        .eq('dor_id', dorId)
        .eq('status', 'Aprovado')

      const agrupado = {}
      ;(cont || []).forEach(c => {
        if (!agrupado[c.instancia_id]) agrupado[c.instancia_id] = []
        agrupado[c.instancia_id].push(c)
      })
      setConteudosPorInstancia(agrupado)
    }
    setLoading(false)
  }

  async function selecionarDor(dorId) {
    await supabase.from('perfis').update({ dor_atual_id: dorId }).eq('id', perfil.id)
    carregar()
  }

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>

  const dorAtual = dores.find(d => d.id === (perfil?.dor_atual_id || dores[0]?.id))

  const ACESSO_RAPIDO = [
    { path: '/', emoji: '🌅', label: 'Reflexão do Dia', desc: 'Comece o dia com intenção' },
    { path: '/checkin', emoji: '✅', label: 'Check-in Diário', desc: 'Suas 3 vitórias' },
    { path: '/premium', emoji: '👑', label: 'Premium', desc: 'Plano e benefícios', premium: !isPremium },
    { path: '/perfil', emoji: '👤', label: 'Perfil', desc: 'Sua trajetória e dados' },
  ]

  return (
    <div className="page-content" style={{ paddingTop: '24px' }}>
      <h2 className="page-title">Olá 👋</h2>
      <p className="page-subtitle">Sua jornada personalizada começa aqui.</p>

      <p className="section-label">Acesso rápido</p>
      <div className="home-grid" style={{ marginBottom: '20px' }}>
        {ACESSO_RAPIDO.map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="card"
            style={{ textAlign: 'left', cursor: 'pointer', border: 'none', width: '100%', fontFamily: 'inherit', color: 'inherit' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '22px' }}>{item.emoji}</span>
              {item.premium && <span className="badge-premium">PRO</span>}
            </div>
            <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>{item.label}</p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.desc}</p>
          </button>
        ))}
      </div>

      <p className="section-label">Sua dor de hoje</p>
      <div className="card">
        <select
          className="input"
          style={{ marginBottom: 0 }}
          value={perfil?.dor_atual_id || ''}
          onChange={e => selecionarDor(e.target.value)}
        >
          {dores.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
        </select>
      </div>

      {instancias.map((inst) => {
        // Regra: Alma é sempre grátis; Corpo e Espírito exigem Premium
        const liberado = inst.nome === 'Alma' || isPremium
        const conteudos = conteudosPorInstancia[inst.id] || []

        if (!liberado) {
          return (
            <div key={inst.id} className="locked-card">
              <p style={{ fontWeight: 600, marginBottom: '8px' }}>{inst.nome}</p>
              <span style={{ fontSize: '20px', display: 'block', marginBottom: '4px' }}>🔒</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Disponível no Premium</span>
            </div>
          )
        }

        return (
          <div key={inst.id} className="card">
            <p style={{ fontWeight: 600, marginBottom: '8px' }}>{inst.nome}</p>
            {conteudos.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Nenhum conteúdo ainda para "{dorAtual?.nome}" em {inst.nome}.</p>
            ) : (
              conteudos.map(c => (
                <a key={c.id} href={c.url_externa} target="_blank" rel="noreferrer" style={{ display: 'block', color: 'var(--text-main)', textDecoration: 'none', fontSize: '14px', padding: '8px 0', borderBottom: '1px solid rgba(201,154,61,0.1)' }}>
                  {c.formato === 'Audio' ? '🎧' : c.formato === 'Video' ? '🎬' : '📖'} {c.titulo}
                </a>
              ))
            )}
          </div>
        )
      })}

      {!isPremium && (
        <button className="btn btn-gold" style={{ marginTop: '8px' }} onClick={() => navigate('/premium')}>
          👑 Desbloquear tudo com Premium
        </button>
      )}
    </div>
  )
}

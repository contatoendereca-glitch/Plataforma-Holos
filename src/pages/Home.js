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

  return (
    <div className="page-content" style={{ paddingTop: '24px' }}>
      <h2 className="page-title">Olá 👋</h2>
      <p className="page-subtitle">Sua jornada personalizada começa aqui.</p>

      <div className="card">
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Dor atual</p>
        <select
          className="input"
          style={{ marginBottom: 0 }}
          value={perfil?.dor_atual_id || ''}
          onChange={e => selecionarDor(e.target.value)}
        >
          {dores.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
        </select>
      </div>

      {instancias.map((inst, idx) => {
        // Regra: Alma (2ª instância) é sempre grátis; Corpo e Espírito exigem Premium
        const liberado = inst.nome === 'Alma' || isPremium
        const conteudos = conteudosPorInstancia[inst.id] || []

        return (
          <div key={inst.id} className={`card ${!liberado ? 'card-locked' : ''}`} style={{ position: 'relative', minHeight: liberado ? 'auto' : '110px' }}>
            <p style={{ fontWeight: 600, marginBottom: '8px' }}>{inst.nome}</p>
            {liberado ? (
              conteudos.length === 0 ? (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Nenhum conteúdo ainda para "{dorAtual?.nome}" em {inst.nome}.</p>
              ) : (
                conteudos.map(c => (
                  <a key={c.id} href={c.url_externa} target="_blank" rel="noreferrer" style={{ display: 'block', color: 'var(--text)', textDecoration: 'none', fontSize: '14px', padding: '8px 0', borderBottom: '1px solid rgba(201,154,61,0.1)' }}>
                    {c.formato === 'Audio' ? '🎧' : c.formato === 'Video' ? '🎬' : '📖'} {c.titulo}
                  </a>
                ))
              )
            ) : (
              <div className="lock-overlay">
                <span style={{ fontSize: '20px' }}>🔒</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Disponível no Premium</span>
              </div>
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

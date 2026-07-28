import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const DIMENSOES = [
  { key: 'nota_corpo', label: 'Corpo', desc: 'Como está seu corpo hoje?' },
  { key: 'nota_alma', label: 'Alma', desc: 'Como está sua alma hoje?' },
  { key: 'nota_espirito', label: 'Espírito', desc: 'Como está seu espírito hoje?' },
]

export default function Checkin() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const hoje = new Date().toISOString().slice(0, 10)

  const [notas, setNotas] = useState({ nota_corpo: null, nota_alma: null, nota_espirito: null })
  const [jaFeito, setJaFeito] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { carregar() }, [user])

  async function carregar() {
    if (!user) return
    const { data } = await supabase
      .from('checkins')
      .select('*')
      .eq('perfil_id', user.id)
      .eq('data', hoje)
      .maybeSingle()

    if (data) {
      setNotas({ nota_corpo: data.nota_corpo, nota_alma: data.nota_alma, nota_espirito: data.nota_espirito })
      setJaFeito(true)
    }
    setLoading(false)
  }

  async function salvar() {
    if (!notas.nota_corpo || !notas.nota_alma || !notas.nota_espirito) return
    setSalvando(true)
    const { error } = await supabase.from('checkins').upsert({
      perfil_id: user.id,
      data: hoje,
      ...notas,
    }, { onConflict: 'perfil_id,data' })

    if (!error) setJaFeito(true)
    setSalvando(false)
  }

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>

  return (
    <div className="page-content" style={{ paddingTop: '24px' }}>
      <h2 className="page-title">Check-in Diário</h2>
      <p className="page-subtitle">Hoje é um novo dia para cuidar de você.</p>

      {DIMENSOES.map(d => (
        <div className="card" key={d.key}>
          <p style={{ fontWeight: 600, marginBottom: '4px' }}>{d.label}</p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>{d.desc}</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                onClick={() => setNotas(prev => ({ ...prev, [d.key]: n }))}
                style={{
                  flex: 1, height: '40px', borderRadius: '10px', cursor: 'pointer',
                  border: notas[d.key] === n ? '1px solid var(--gold)' : '1px solid rgba(201,154,61,0.2)',
                  background: notas[d.key] === n ? 'rgba(201,154,61,0.15)' : '#0A1013',
                  color: notas[d.key] === n ? 'var(--gold)' : 'var(--text-muted)',
                  fontWeight: 600,
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      ))}

      {jaFeito ? (
        <div className="card" style={{ textAlign: 'center', borderColor: 'var(--success)' }}>
          <p style={{ color: 'var(--success)', fontWeight: 600 }}>✓ Check-in de hoje salvo</p>
        </div>
      ) : (
        <button className="btn btn-gold" disabled={salvando} onClick={salvar} style={{ marginTop: '8px' }}>
          {salvando ? 'Salvando...' : 'Salvar check-in'}
        </button>
      )}

      <button className="btn btn-outline" style={{ marginTop: '10px' }} onClick={() => navigate('/home')}>
        Ver minha Home
      </button>
    </div>
  )
}

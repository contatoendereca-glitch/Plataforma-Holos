import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const ATALHOS = [
  { to: '/registro', titulo: 'Registro rápido', desc: 'gratidão e diário holos', icone: '🙏' },
  { to: '/dor', titulo: 'Eu Hoje', desc: 'escolha uma dor pra cuidar', icone: '💛' },
  { to: '/calendario', titulo: 'Calendário', desc: 'veja tudo que você registrou', icone: '📅' },
  { to: '/store', titulo: 'Holos Store', desc: 'curadoria de parceiros', icone: '🛍️' },
]

export default function ReflexaoDiaria() {
  const navigate = useNavigate()
  const [reflexao, setReflexao] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { carregar() }, [])

  async function carregar() {
    // Escolhe uma reflexão ativa de forma pseudo-aleatória, mas estável no dia
    const { data } = await supabase
      .from('reflexoes_diarias')
      .select('*')
      .eq('ativo', true)

    if (data && data.length > 0) {
      const diaDoAno = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
      setReflexao(data[diaDoAno % data.length])
    }
    setLoading(false)
  }

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>

  return (
    <div className="page-content" style={{ paddingTop: '40px' }}>
      <h2 className="page-title">Reflexão do Dia</h2>
      <div className="card" style={{ padding: '28px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: '17px', lineHeight: '1.6', fontStyle: 'italic' }}>
          {reflexao ? `"${reflexao.texto}"` : 'Nenhuma reflexão cadastrada ainda.'}
        </p>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <button className="btn btn-outline">Compartilhar</button>
      </div>

      <div className="home-grid" style={{ marginTop: '24px' }}>
        {ATALHOS.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="card"
            style={{ textAlign: 'center', textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{ fontSize: 26, marginBottom: 8 }}>{a.icone}</div>
            <p style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>{a.titulo}</p>
            <p className="page-subtitle" style={{ marginBottom: 0, fontSize: 11 }}>{a.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

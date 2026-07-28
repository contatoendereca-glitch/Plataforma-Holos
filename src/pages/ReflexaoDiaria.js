import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

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
        <button className="btn btn-outline">Salvar</button>
        <button className="btn btn-outline">Compartilhar</button>
      </div>
      <button className="btn btn-gold" style={{ marginTop: '20px' }} onClick={() => navigate('/checkin')}>
        Continuar jornada
      </button>
    </div>
  )
}

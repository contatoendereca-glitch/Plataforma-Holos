import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const ATALHOS = [
  { to: '/registro', titulo: 'Registro rápido', desc: 'Gratidão · Diário Holos', icone: '🙏' },
  { to: '/dor', titulo: 'Eu Hoje', desc: 'escolha uma dor pra cuidar', icone: '💛' },
  { to: '/calendario', titulo: 'Calendário', desc: 'veja tudo que você registrou', icone: '📅' },
  { to: '/store', titulo: 'Holos Store', desc: 'curadoria de produtos parceiros', icone: '🛍️' },
]

export default function ReflexaoDiaria() {
  const [reflexao, setReflexao] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lendo, setLendo] = useState(false)

  useEffect(() => { carregar() }, [])

  async function carregar() {
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

  function compartilhar() {
    if (!reflexao) return
    const mensagem = `"${reflexao.texto}"\n\n— Plataforma Holos 🕊️\n📲 https://plataforma-holos.vercel.app\n📸 @psi.fernandalima_`
    window.open(`https://wa.me/?text=${encodeURIComponent(mensagem)}`, '_blank')
  }

  function ouvir() {
    if (!reflexao || !window.speechSynthesis) return
    window.speechSynthesis.cancel() // corta qualquer leitura anterior
    const fala = new SpeechSynthesisUtterance(reflexao.texto)
    fala.lang = 'pt-BR'
    fala.onstart = () => setLendo(true)
    fala.onend = () => setLendo(false)
    window.speechSynthesis.speak(fala)
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

      <div style={{ display: 'flex', gap: '8px', marginTop: '16px', marginBottom: '24px' }}>
        <button className="btn btn-outline" onClick={compartilhar}>Compartilhar</button>
        <button className="btn btn-outline" onClick={ouvir} disabled={!reflexao}>
          {lendo ? 'Lendo...' : 'Ouvir'}
        </button>
      </div>

      {ATALHOS.map((a) => (
        <Link
          key={a.to}
          to={a.to}
          className="pro-card"
          style={{ textDecoration: 'none', color: 'inherit', alignItems: 'center' }}
        >
          <span style={{ fontSize: 22 }}>{a.icone}</span>
          <div style={{ flex: 1 }}>
            <p className="section-label" style={{ marginBottom: 2 }}>{a.titulo}</p>
            <p className="page-subtitle" style={{ margin: 0, fontSize: 12 }}>{a.desc}</p>
          </div>
          <span style={{ color: 'var(--gold)' }}>›</span>
        </Link>
      ))}
    </div>
  )
}

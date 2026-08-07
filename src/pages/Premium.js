import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const BENEFICIOS = [
  'Corpo, Mente e Consciência completos, todos os dias',
  'Mapa Holos — veja sua evolução nas 3 dimensões',
  'Avaliação Evolutiva Holos após 30 dias de uso',
  'Leitura Holos personalizada semanal',
  'Matches ilimitados com profissionais',
]

export default function Premium() {
  const { user, isPremium } = useAuth()
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  async function assinar() {
    setErro('')
    setCarregando(true)
    try {
      const resp = await fetch('/api/criar-assinatura', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      })
      const data = await resp.json()
      if (!resp.ok || !data.init_point) {
        setErro('Não foi possível iniciar o checkout. Tente novamente.')
        setCarregando(false)
        return
      }
      window.location.href = data.init_point
    } catch (e) {
      setErro('Erro de conexão. Tente novamente.')
      setCarregando(false)
    }
  }

  return (
    <div className="page-content" style={{ paddingTop: '24px', textAlign: 'center' }}>
      <div style={{ fontSize: '40px', marginBottom: '8px' }}>👑</div>
      <h2 className="page-title">Plataforma Holos Premium</h2>
      <p className="page-subtitle">Desbloqueie sua jornada completa de transformação.</p>

      {isPremium ? (
        <div className="card" style={{ borderColor: 'var(--success)' }}>
          <p style={{ color: 'var(--success)', fontWeight: 600 }}>✓ Você já é Premium</p>
        </div>
      ) : (
        <>
          <div className="card" style={{ textAlign: 'left' }}>
            {BENEFICIOS.map((b, i) => (
              <p key={i} style={{ fontSize: '14px', padding: '8px 0', borderBottom: i < BENEFICIOS.length - 1 ? '1px solid rgba(201,154,61,0.1)' : 'none' }}>
                ✦ {b}
              </p>
            ))}
          </div>

          <div className="card">
            <p style={{ fontSize: '28px', fontWeight: 700, color: 'var(--gold)' }}>R$ 39,90<span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 400 }}> /mês</span></p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ou R$ 299,90/ano (equivale a R$ 24,99/mês)</p>
          </div>

          {erro && <p style={{ color: 'var(--danger)', fontSize: '13px', marginBottom: '10px' }}>{erro}</p>}

          <button className="btn btn-gold" onClick={assinar} disabled={carregando}>
            {carregando ? 'Preparando checkout...' : '👑 Quero ser Premium'}
          </button>
        </>
      )}
    </div>
  )
}

import { useAuth } from '../context/AuthContext'

const BENEFICIOS = [
  'Corpo, Alma e Espírito completos, todos os dias',
  'Mapa Holos — veja sua evolução nas 3 dimensões',
  'Avaliação Evolutiva Holos após 30 dias de uso',
  'Leitura Holos personalizada semanal',
  'Matches ilimitados com profissionais',
]

export default function Premium() {
  const { isPremium } = useAuth()

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

          {/* Checkout real entra na Fase 3, junto com Stripe/Mercado Pago */}
          <button className="btn btn-gold" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
            Checkout em breve
          </button>
        </>
      )}
    </div>
  )
}

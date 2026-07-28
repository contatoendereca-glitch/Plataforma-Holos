import { useAuth } from '../context/AuthContext'

export default function Perfil() {
  const { perfil, sair, isPremium } = useAuth()

  return (
    <div className="page-content" style={{ paddingTop: '24px' }}>
      <h2 className="page-title">Perfil</h2>

      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 12px',
          background: 'rgba(201,154,61,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', color: 'var(--gold)', fontWeight: 700,
        }}>
          {perfil?.nome?.[0]?.toUpperCase() || '?'}
        </div>
        <p style={{ fontWeight: 600, fontSize: '16px' }}>{perfil?.nome || 'Sem nome'}</p>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>{perfil?.email}</p>
        <span className={`badge ${isPremium ? 'badge-premium' : 'badge-gratuito'}`}>
          {isPremium ? '👑 Premium' : 'Gratuito'}
        </span>
      </div>

      <button className="btn btn-outline" onClick={sair}>Sair</button>
    </div>
  )
}

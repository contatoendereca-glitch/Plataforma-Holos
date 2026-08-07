import { ReactComponent as HolosLogo } from '../assets/holos-logo.svg'

export default function Sobre() {
  return (
    <div className="page-content" style={{ paddingTop: '48px', textAlign: 'center' }}>
      <HolosLogo width={88} height={88} style={{ marginBottom: '12px' }} />
      <h1 className="titulo" style={{ color: 'var(--gold)', fontSize: '24px', marginBottom: '4px' }}>
        PLATAFORMA HOLOS
      </h1>
      <p className="page-subtitle" style={{ fontStyle: 'italic', marginBottom: '24px' }}>
        A direção é para dentro.
      </p>

      <div className="card-gold" style={{ textAlign: 'left' }}>
        <p style={{ fontFamily: 'Cinzel, serif', fontSize: '17px', color: 'var(--gold)', marginBottom: '4px' }}>
          Fernanda Lima
        </p>
        <p className="page-subtitle" style={{ marginBottom: '12px' }}>idealizadora da Holos</p>
        <p style={{ fontSize: '14px', lineHeight: 1.6 }}>
          Psicanálise · Neurociência (PUC) · Sagrada Escritura
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
        
          className="btn btn-outline btn-sm"
          href="https://instagram.com/psi.fernandalima_"
          target="_blank"
          rel="noreferrer"
        >
          Instagram
        </a>
        
          className="btn btn-outline btn-sm"
          href="https://www.youtube.com/@psicanalista.fernandalima"
          target="_blank"
          rel="noreferrer"
        >
          YouTube
        </a>
      </div>
    </div>
  )
}

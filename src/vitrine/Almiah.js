import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CAMINHOS, INTEGRACAO } from '../data/cursos'

// Almiah: guia da Plataforma Holos. Por enquanto, ajuda de navegação
// (não há conversa integrada no projeto).

const FRENTES = [...CAMINHOS, INTEGRACAO]

function Lotus(props) {
  return (
    <svg viewBox="0 0 32 24" width="22" height="17" aria-hidden="true" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M16 3c3 3.2 4 7 3 10.6-.7 2.6-1.8 4.4-3 5.9-1.2-1.5-2.3-3.3-3-5.9C12 10 13 6.2 16 3z" />
        <path d="M13.3 19.2C10 18.6 6.6 16.4 4.6 12.6c3.2-.4 6.2.6 8.3 2.6" />
        <path d="M18.7 19.2c3.3-.6 6.7-2.8 8.7-6.6-3.2-.4-6.2.6-8.3 2.6" />
        <path d="M5 20.5h22" />
      </g>
    </svg>
  )
}

// Miniatura circular do retrato da Almiah.
// A imagem é o retrato inteiro (Almiah_original.png, em versão leve com o mesmo
// enquadramento); o recorte do rosto, dos óculos e do cabelo é feito só pelo CSS.
function Retrato({ tamanho }) {
  const [falhou, setFalhou] = useState(false)
  if (falhou) return <Lotus />
  return (
    <span className="almiah-retrato" style={{ width: tamanho, height: tamanho }}>
      <img src="/img/almiah-botao.webp" alt="" onError={() => setFalhou(true)} />
    </span>
  )
}

const ATALHOS = [
  { id: 'quem', rotulo: 'Quem é Almiah?' },
  { id: 'frentes', rotulo: 'Conhecer as frentes' },
  { id: 'comecar', rotulo: 'Por onde posso começar?' },
]

function Resposta({ id, fechar }) {
  if (id === 'quem') {
    return (
      <>
        <p>
          Eu sou a Almiah, guia da Plataforma Holos. Estou aqui para ajudar você a encontrar o seu caminho entre os
          cursos. Nas aulas, trago curiosidades e reflexões ao longo dos módulos.
        </p>
        <p className="almiah-nota">Minha voz nas aulas é gerada por inteligência artificial.</p>
        <Link to="/sobre" className="almiah-link" onClick={fechar}>Conhecer a Plataforma Holos</Link>
      </>
    )
  }
  if (id === 'frentes') {
    return (
      <>
        <p>Os cursos se organizam em três frentes, que se encontram na Integração:</p>
        <ul className="almiah-lista">
          {FRENTES.map((f) => (
            <li key={f.id}>
              <Link to={`/cursos?frente=${f.id}`} className="almiah-link" onClick={fechar}>
                <strong>{f.nome}</strong>
                <span>{f.lema}</span>
              </Link>
            </li>
          ))}
        </ul>
      </>
    )
  }
  return (
    <>
      <p>
        Uma boa porta de entrada é o <strong>Holos Identidade: Quem Sou Eu?</strong>, que apresenta corpo, alma e
        espírito juntos e indica caminhos para se aprofundar.
      </p>
      <Link to="/cursos/i10" className="almiah-link" onClick={fechar}>Ver Holos Identidade</Link>
      <p>Se preferir, escolha a frente que mais chama você agora:</p>
      <div className="almiah-chips">
        {FRENTES.map((f) => (
          <Link key={f.id} to={`/cursos?frente=${f.id}`} onClick={fechar}>{f.nome}</Link>
        ))}
      </div>
    </>
  )
}

export default function Almiah() {
  const [aberta, setAberta] = useState(false)
  const [resposta, setResposta] = useState(null)
  const painelRef = useRef(null)
  const botaoRef = useRef(null)
  const devolverFoco = useRef(false)
  const { pathname, search } = useLocation()

  useEffect(() => {
    setAberta(false)
  }, [pathname, search])

  useEffect(() => {
    if (!aberta) {
      if (devolverFoco.current) botaoRef.current?.focus()
      devolverFoco.current = false
      return
    }
    painelRef.current?.querySelector('h2')?.focus()
    function esc(e) {
      if (e.key === 'Escape') fechar(true)
    }
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [aberta])

  function fechar(foco) {
    devolverFoco.current = foco
    setAberta(false)
    setResposta(null)
  }

  return (
    <div className="almiah">
      {aberta && (
        <section ref={painelRef} className="almiah-painel" role="dialog" aria-modal="false" aria-labelledby="almiah-titulo">
          <header className="almiah-topo">
            <Retrato tamanho={36} />
            <h2 id="almiah-titulo" tabIndex={-1}>Almiah</h2>
            <button className="almiah-fechar" onClick={() => fechar(true)} aria-label="Fechar Almiah">×</button>
          </header>
          {resposta ? (
            <div className="almiah-resposta">
              <button className="almiah-voltar" onClick={() => setResposta(null)}>‹ Voltar</button>
              <Resposta id={resposta} fechar={() => fechar(false)} />
            </div>
          ) : (
            <>
              <p className="almiah-saudacao">Olá! Sou a guia da Plataforma Holos. Como posso ajudar?</p>
              <ul className="almiah-atalhos">
                {ATALHOS.map((a) => (
                  <li key={a.id}>
                    <button onClick={() => setResposta(a.id)}>
                      {a.rotulo}
                      <span aria-hidden="true">›</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}
      {!aberta && (
        <button
          ref={botaoRef}
          className="almiah-botao"
          onClick={() => setAberta(true)}
          aria-expanded="false"
          aria-label="Abrir Almiah, guia da Plataforma Holos"
        >
          <Retrato tamanho={38} />
          <span>Almiah</span>
        </button>
      )}
    </div>
  )
}

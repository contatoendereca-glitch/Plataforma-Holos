import { useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CAMINHOS, cursosDaFrente } from '../data/cursos'
import CartaoCurso from './CartaoCurso'

const INICIAIS = 6

export default function Catalogo() {
  const [params, setParams] = useSearchParams()
  const pedida = params.get('frente') || params.get('caminho')
  const ativa = CAMINHOS.some((c) => c.id === pedida) ? pedida : CAMINHOS[0].id
  const frente = CAMINHOS.find((c) => c.id === ativa)
  const cursos = cursosDaFrente(ativa)

  // "Ver mais" vale para a aba aberta; ao trocar de aba, volta a mostrar seis.
  const [expandida, setExpandida] = useState(null)
  const todos = expandida === ativa
  const visiveis = todos ? cursos : cursos.slice(0, INICIAIS)

  const abasRef = useRef([])

  function escolher(id, foco = false) {
    setParams({ frente: id })
    if (foco) abasRef.current[CAMINHOS.findIndex((c) => c.id === id)]?.focus()
  }

  function teclado(e, i) {
    const n = CAMINHOS.length
    let alvo = null
    if (e.key === 'ArrowRight') alvo = (i + 1) % n
    if (e.key === 'ArrowLeft') alvo = (i - 1 + n) % n
    if (e.key === 'Home') alvo = 0
    if (e.key === 'End') alvo = n - 1
    if (alvo !== null) {
      e.preventDefault()
      escolher(CAMINHOS[alvo].id, true)
    }
  }

  return (
    <section className="v-secao v-secao-topo">
      <div className="v-container">
        <h1 className="v-titulo-pagina">Cursos</h1>
        <p className="v-texto v-texto-largo">
          Cursos livres, com certificado de conclusão e a metodologia Lente Holos. Escolha uma frente.
        </p>

        <div className="v-abas" role="tablist" aria-label="Frentes de cursos">
          {CAMINHOS.map((c, i) => (
            <button
              key={c.id}
              ref={(el) => (abasRef.current[i] = el)}
              role="tab"
              id={`aba-${c.id}`}
              aria-selected={c.id === ativa}
              aria-controls="painel-cursos"
              tabIndex={c.id === ativa ? 0 : -1}
              className={c.id === ativa ? 'ativa' : ''}
              onClick={() => escolher(c.id)}
              onKeyDown={(e) => teclado(e, i)}
            >
              {c.nome}
            </button>
          ))}
        </div>

        <div id="painel-cursos" role="tabpanel" aria-labelledby={`aba-${ativa}`} className="v-painel">
          <p className="v-painel-lema">
            {frente.lema} <span>{cursos.length} cursos</span>
          </p>
          <div className="v-grade-cursos">
            {visiveis.map((c) => (
              <CartaoCurso key={c.codigo} curso={c} />
            ))}
          </div>
          {cursos.length > INICIAIS && (
            <p className="v-centro">
              {todos ? (
                <button className="v-botao v-botao-linha" onClick={() => setExpandida(null)}>
                  Mostrar menos
                </button>
              ) : (
                <button className="v-botao v-botao-linha" onClick={() => setExpandida(ativa)}>
                  Ver mais cursos ({cursos.length - INICIAIS})
                </button>
              )}
            </p>
          )}
        </div>

        <p className="v-pequeno v-nota-integracao">
          Alguns cursos unem mais de uma frente e aparecem em mais de uma aba. Entenda a integração das três frentes em{' '}
          <Link to="/sobre#lente-holos">Sobre a Lente Holos</Link>.
        </p>
      </div>
    </section>
  )
}

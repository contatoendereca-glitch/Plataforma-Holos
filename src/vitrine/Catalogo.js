import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CAMINHOS, INTEGRACAO, cursosDaFrente } from '../data/cursos'
import CartaoCurso from './CartaoCurso'

const INICIAIS = 6
const VALIDAS = [...CAMINHOS.map((c) => c.id), INTEGRACAO.id]

export default function Catalogo() {
  const [params] = useSearchParams()
  const pedida = params.get('frente') || params.get('caminho')
  const ativa = VALIDAS.includes(pedida) ? pedida : CAMINHOS[0].id
  const ehIntegracao = ativa === INTEGRACAO.id
  const frente = ehIntegracao ? INTEGRACAO : CAMINHOS.find((c) => c.id === ativa)
  const cursos = cursosDaFrente(ativa)

  // "Ver mais" vale para a frente aberta; ao trocar de frente, volta a mostrar seis.
  const [expandida, setExpandida] = useState(null)
  const todos = expandida === ativa
  const visiveis = todos ? cursos : cursos.slice(0, INICIAIS)

  return (
    <div className="c-pagina">
      <div className="c-janela" aria-hidden="true" style={{ '--img-janela': "url('/img/catalogo-janela.webp')" }} />
      <section className="c-conteudo">
        <div className="c-container">
          <h1 className="c-titulo">Cursos Holos</h1>
          <span className="c-traco" aria-hidden="true" />

          <nav className="c-navegacao" aria-label="Frentes de cursos">
            <ul className="c-abas">
              {CAMINHOS.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/cursos?frente=${c.id}`}
                    className={c.id === ativa ? 'ativa' : ''}
                    aria-current={c.id === ativa ? 'page' : undefined}
                  >
                    {c.nome}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to={`/cursos?frente=${INTEGRACAO.id}`}
              className={`c-integracao ${ehIntegracao ? 'ativa' : ''}`}
              aria-current={ehIntegracao ? 'page' : undefined}
            >
              <img src="/img/medalhao-arvore.webp" alt="" width="22" height="22" />
              Integração
            </Link>
          </nav>

          <ul className="c-inclui" aria-label="Todos os cursos incluem">
            <li>Curso livre</li>
            <li>Certificado de conclusão</li>
            <li>Atividades</li>
            <li>Materiais complementares</li>
          </ul>

          <section className="c-painel" aria-labelledby="titulo-frente">
            <div className="c-painel-topo">
              <h2 id="titulo-frente" className="c-titulo-frente">
                {ehIntegracao ? 'Cursos de Integração' : `Cursos de ${frente.nome}`}
              </h2>
              <p className="c-lema">
                {frente.lema} <span>{cursos.length} cursos</span>
              </p>
            </div>
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
          </section>

          <p className="v-pequeno c-nota">
            {ehIntegracao
              ? 'Os cursos de Integração reúnem corpo, alma e espírito numa mesma jornada. '
              : 'Alguns cursos unem mais de uma frente e aparecem em mais de uma aba. '}
            Saiba mais em <Link to="/sobre#lente-holos">Sobre a Lente Holos</Link>.
          </p>
        </div>
      </section>
    </div>
  )
}

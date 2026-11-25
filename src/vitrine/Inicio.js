import { Link } from 'react-router-dom'
import { CAMINHOS, CURSOS, PRIMEIROS } from '../data/cursos'
import CartaoCurso from './CartaoCurso'

export default function Inicio() {
  const primeiros = PRIMEIROS.map((c) => CURSOS.find((x) => x.codigo === c))

  return (
    <>
      <section className="v-abertura" aria-labelledby="titulo-abertura">
        <picture className="v-abertura-foto">
          <source
            media="(max-width: 700px)"
            type="image/webp"
            srcSet="/img/recepcao-movel-430.webp 430w, /img/recepcao-movel-860.webp 860w"
            sizes="100vw"
          />
          <source
            media="(max-width: 700px)"
            srcSet="/img/recepcao-movel-430.jpg 430w, /img/recepcao-movel-860.jpg 860w"
            sizes="100vw"
          />
          <source
            type="image/webp"
            srcSet="/img/recepcao-1200.webp 1200w, /img/recepcao-1670.webp 1670w"
            sizes="100vw"
          />
          <img
            src="/img/recepcao-1670.jpg"
            srcSet="/img/recepcao-1200.jpg 1200w, /img/recepcao-1670.jpg 1670w"
            sizes="100vw"
            alt="Recepção da Plataforma Holos, em tons de café e dourado, com o letreiro Plataforma Holos e a árvore na parede."
            fetchpriority="high"
          />
        </picture>
        <div className="v-abertura-texto">
          <div className="v-container">
            <h1 id="titulo-abertura" className="v-abertura-titulo">Direção para dentro</h1>
            <p className="v-abertura-frase">Cursos de autoconhecimento e desenvolvimento humano</p>
            <Link to="/cursos" className="v-botao v-botao-marfim">Explorar cursos</Link>
          </div>
        </div>
      </section>

      <section className="v-entradas" aria-label="Frentes de cursos">
        <div className="v-container">
          <ul className="v-entradas-lista">
            {CAMINHOS.map((c) => (
              <li key={c.id}>
                <Link to={`/cursos?frente=${c.id}`} className="v-entrada">
                  <span className="v-entrada-nome">{c.nome}</span>
                  <span className="v-entrada-texto">{c.lema}</span>
                  <span className="v-entrada-seta" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="v-secao-home">
        <div className="v-container">
          <div className="v-cabecalho-secao">
            <h2 className="v-titulo-secao">Primeiros lançamentos</h2>
            <Link to="/cursos" className="v-link">Ver todos os cursos →</Link>
          </div>
          <div className="v-grade-cursos">
            {primeiros.map((c) => (
              <CartaoCurso key={c.codigo} curso={c} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

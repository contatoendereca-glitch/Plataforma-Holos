import { Link } from 'react-router-dom'
import { ReactComponent as HolosLogo } from '../assets/holos-logo.svg'
import { CAMINHOS, CURSOS, PRIMEIROS, METODOLOGIA, PERGUNTAS_DIARIO } from '../data/cursos'
import CartaoCurso from './CartaoCurso'

export default function Inicio() {
  const primeiros = PRIMEIROS.map((c) => CURSOS.find((x) => x.codigo === c))
  const [principal, ...outros] = primeiros

  return (
    <>
      <section className="v-hero">
        <div className="v-container v-hero-conteudo">
          <HolosLogo className="v-hero-logo" width={112} height={112} aria-hidden="true" />
          <p className="v-sobretitulo">Corpo · Alma · Espírito</p>
          <h1 className="v-hero-titulo">Direção para dentro</h1>
          <p className="v-hero-texto">
            Uma plataforma de conhecimento, autoconhecimento e desenvolvimento humano, fundamentada no diálogo entre
            neurociência, psicanálise, psicologia e valores cristãos.
          </p>
          <div className="v-acoes">
            <Link to="/cursos" className="v-botao">Conhecer os cursos</Link>
            <Link to="/sobre" className="v-botao v-botao-linha">Sobre a Holos</Link>
          </div>
        </div>
      </section>

      <section className="v-secao">
        <div className="v-container">
          <p className="v-sobretitulo">Quatro caminhos</p>
          <h2 className="v-titulo-secao">Por onde você quer começar?</h2>
          <div className="v-grade-caminhos">
            {CAMINHOS.map((c) => (
              <Link key={c.id} to={`/cursos?caminho=${c.id}`} className={`v-caminho caminho-${c.id}`}>
                <span className="v-caminho-nome">{c.nome}</span>
                <span className="v-caminho-lema">{c.lema}</span>
                <span className="v-caminho-texto">{c.texto}</span>
                <span className="v-cartao-mais">Ver cursos →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="v-secao v-secao-bege">
        <div className="v-container">
          <p className="v-sobretitulo">Primeiros lançamentos</p>
          <h2 className="v-titulo-secao">Os cursos que abrem a Holos</h2>
          <div className="v-grade-primeiros">
            <CartaoCurso curso={principal} destaque />
            <div className="v-grade-cursos v-grade-2">
              {outros.map((c) => (
                <CartaoCurso key={c.codigo} curso={c} />
              ))}
            </div>
          </div>
          <p className="v-centro">
            <Link to="/cursos" className="v-botao v-botao-linha">Ver o catálogo completo</Link>
          </p>
        </div>
      </section>

      <section className="v-secao">
        <div className="v-container v-duas-colunas">
          <div>
            <p className="v-sobretitulo">Metodologia exclusiva</p>
            <h2 className="v-titulo-secao">A Lente Holos</h2>
            <p className="v-texto">
              Cada curso olha para o mesmo tema por três perspectivas, sem confundi-las: o corpo, a alma e o espírito.
              Ao final, a Lente Holos reúne o que foi aprendido numa direção prática para a sua vida.
            </p>
            <div className="v-diario">
              <p className="v-diario-titulo">O diário Holos</p>
              <ul>
                {PERGUNTAS_DIARIO.map(([rotulo, pergunta]) => (
                  <li key={rotulo}>
                    <span>{rotulo}</span>
                    {pergunta}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <p className="v-lista-titulo">Todos os cursos terão</p>
            <ul className="v-lista-check">
              {METODOLOGIA.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="v-secao v-secao-marrom">
        <div className="v-container v-chamada">
          <div>
            <p className="v-sobretitulo">Para psicólogos e psicanalistas</p>
            <h2 className="v-titulo-secao">Profissionais Parceiros Holos</h2>
            <p className="v-texto">
              Estamos formando uma rede de profissionais que compartilham a visão da Holos e queiram conhecer de perto
              os nossos cursos.
            </p>
          </div>
          <Link to="/parceiros" className="v-botao v-botao-claro">Quero conhecer</Link>
        </div>
      </section>
    </>
  )
}

import { Link } from 'react-router-dom'
import { MOVIMENTOS } from '../data/cursos'

export default function Metodo() {
  return (
    <section className="v-secao v-secao-topo">
      <div className="v-container v-estreito">
        <p className="v-sobretitulo">Direção para dentro</p>
        <h1 className="v-titulo-pagina">O Método Holos</h1>
        <p className="v-texto v-texto-destaque">
          Quatro movimentos que se repetem em cada curso e em cada registro do diário: perceber, reconhecer, discernir
          e agir.
        </p>

        <figure className="m-figura">
          <img
            src="/img/metodo-holos-circulo.webp"
            width="1080"
            height="1080"
            alt="Ciclo do Método Holos: Corpo, Perceber; Alma, Reconhecer; Espírito, Discernir; Integração, Agir. Setas ligam um movimento ao seguinte, em volta da palavra Holos, direção para dentro."
          />
        </figure>

        <h2 className="v-subtitulo">Os quatro movimentos</h2>
        <ol className="m-movimentos">
          {MOVIMENTOS.map((m, i) => (
            <li key={m.verbo}>
              <span className="m-numero" aria-hidden="true">{i + 1}</span>
              <div>
                <p className="m-frente">{m.frente}</p>
                <h3 className="m-verbo">{m.verbo}</h3>
                <p className="m-pergunta">{m.pergunta}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="v-texto">
          O ciclo não termina no agir: cada pequena ação traz novas percepções, e o caminho recomeça, sempre na direção
          para dentro. As quatro perguntas são as do diário Holos, presente em todos os cursos.
        </p>
        <p className="v-pequeno">
          O Método Holos é uma proposta pedagógica para organizar o estudo e a reflexão. Não é uma classificação
          científica e não substitui terapia nem tratamento de saúde.
        </p>
        <div className="v-acoes">
          <Link to="/cursos" className="v-botao">Conhecer os cursos</Link>
          <Link to="/sobre#lente-holos" className="v-botao v-botao-linha">A Lente Holos</Link>
        </div>
      </div>
    </section>
  )
}

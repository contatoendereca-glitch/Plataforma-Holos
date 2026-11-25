import { Link } from 'react-router-dom'
import { CAMINHOS } from '../data/cursos'

export default function Sobre() {
  return (
    <section className="v-secao v-secao-topo">
      <div className="v-container v-estreito">
        <p className="v-sobretitulo">Sobre</p>
        <h1 className="v-titulo-pagina">A Plataforma Holos</h1>
        <p className="v-texto v-texto-destaque">
          Holos é uma plataforma de conhecimento, autoconhecimento e desenvolvimento humano. Nosso convite cabe em
          três palavras: direção para dentro.
        </p>
        <p className="v-texto">
          Acreditamos que o ser humano é um todo, e que corpo, alma e espírito podem ser compreendidos juntos sem
          serem confundidos. Por isso, nossos cursos colocam em diálogo a neurociência, a psicanálise, a psicologia e
          os valores cristãos, numa fé ampla e sem denominação.
        </p>
        <p className="v-texto">
          O modelo Corpo, Alma e Espírito é uma proposta pedagógica da Holos, uma forma de organizar o estudo e a
          reflexão, e não uma classificação científica.
        </p>

        <h2 className="v-subtitulo">Os quatro caminhos</h2>
        <ul className="v-lista-caminhos">
          {CAMINHOS.map((c) => (
            <li key={c.id}>
              <Link to={`/cursos?caminho=${c.id}`}>Holos {c.nome}</Link>
              <span>{c.lema}</span>
            </li>
          ))}
        </ul>

        <h2 className="v-subtitulo">Quem idealizou</h2>
        <div className="v-caixa">
          <p className="v-nome">Fernanda Lima</p>
          <p className="v-pequeno">Idealizadora da Holos</p>
          <p className="v-texto">Psicanálise · Neurociência (PUC) · Sagrada Escritura</p>
          <div className="v-acoes">
            <a className="v-botao v-botao-linha" href="https://instagram.com/psi.fernandalima_" target="_blank" rel="noreferrer">Instagram</a>
            <a className="v-botao v-botao-linha" href="https://www.youtube.com/@psicanalista.fernandalima" target="_blank" rel="noreferrer">YouTube</a>
          </div>
        </div>

        <h2 className="v-subtitulo">Almiah</h2>
        <p className="v-texto">
          Nas aulas, você vai encontrar a Almiah, que traz curiosidades e reflexões ao longo dos módulos. A voz da
          Almiah é gerada por inteligência artificial.
        </p>

        <h2 className="v-subtitulo">Sobre os cursos</h2>
        <p className="v-texto">
          Todos os cursos Holos são cursos livres, com certificado de conclusão. São espaços de estudo e reflexão:
          não substituem terapia nem tratamento de saúde, e não habilitam para atendimento clínico.
        </p>
      </div>
    </section>
  )
}

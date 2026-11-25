import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CAMINHOS, INTEGRACAO, METODOLOGIA, PERGUNTAS_DIARIO } from '../data/cursos'

export default function Sobre() {
  const { hash } = useLocation()
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [hash])

  return (
    <section className="v-secao v-secao-topo">
      <div className="v-container v-estreito">
        <h1 className="v-titulo-pagina">Sobre a Plataforma Holos</h1>
        <p className="v-texto v-texto-destaque">
          Holos é uma plataforma de conhecimento, autoconhecimento e desenvolvimento humano. Nosso convite cabe em
          três palavras: direção para dentro.
        </p>
        <p className="v-texto">
          Acreditamos que o ser humano é um todo, e que corpo, alma e espírito podem ser compreendidos juntos sem
          serem confundidos. Por isso, nossos cursos colocam em diálogo a neurociência, a psicanálise, a psicologia e
          os valores cristãos, numa fé ampla e sem denominação.
        </p>

        <h2 className="v-subtitulo">As três frentes</h2>
        <ul className="v-lista-caminhos">
          {CAMINHOS.map((c) => (
            <li key={c.id}>
              <Link to={`/cursos?frente=${c.id}`}>{c.nome}</Link>
              <span>{c.lema} {c.texto}</span>
            </li>
          ))}
        </ul>

        <h2 className="v-subtitulo" id="lente-holos">A Lente Holos</h2>
        <p className="v-texto">
          A Lente Holos é a metodologia própria da plataforma. Cada curso olha para o seu tema pelas três frentes,
          uma de cada vez: o que o corpo mostra, o que a alma reconhece e o que o espírito escolhe. Depois, reúne essas
          perspectivas numa direção prática para a vida.
        </p>

        <h3 className="v-subtitulo-menor">{INTEGRACAO.nome}: {INTEGRACAO.lema.toLowerCase()}</h3>
        <p className="v-texto">
          A integração é o passo em que as três frentes se encontram. Ela acontece em todos os cursos, na Mini-Lente
          ao fim de cada módulo e no módulo-assinatura Lente Holos, e ganha cursos próprios, como{' '}
          <Link to="/cursos/i10">Holos Identidade: Quem Sou Eu?</Link> e{' '}
          <Link to="/cursos/i22">Introdução à Metodologia Holos</Link>, reunidos no catálogo em{' '}
          <Link to="/cursos?frente=integracao">Cursos de Integração</Link>.
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

        <h3 className="v-subtitulo-menor">Todos os cursos terão</h3>
        <ul className="v-lista-check v-duas-col-lista">
          {METODOLOGIA.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
        <p className="v-pequeno">
          O modelo Corpo, Alma e Espírito é uma proposta pedagógica da Holos, uma forma de organizar o estudo e a
          reflexão, e não uma classificação científica.
        </p>

        <h2 className="v-subtitulo">Quem idealizou</h2>
        <div className="v-caixa">
          <p className="v-nome">Fernanda Lima</p>
          <p className="v-pequeno">Idealizadora da Plataforma Holos</p>
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

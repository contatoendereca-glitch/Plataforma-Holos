import { Link, useParams } from 'react-router-dom'
import { buscarCurso, buscarCaminho, CURSOS, METODOLOGIA } from '../data/cursos'
import CartaoCurso from './CartaoCurso'
import NaoEncontrada from './NaoEncontrada'

export default function CursoPagina() {
  const { codigo } = useParams()
  const curso = buscarCurso(codigo)
  if (!curso) return <NaoEncontrada />

  const caminho = buscarCaminho(curso.caminho)
  const relacionados = CURSOS.filter((c) => c.caminho === curso.caminho && c.codigo !== curso.codigo)
    .sort((a, b) => b.primeiro - a.primeiro)
    .slice(0, 3)

  return (
    <>
      <section className={`v-curso-topo caminho-${curso.caminho}`}>
        <div className="v-container">
          <Link to={`/cursos?caminho=${caminho.id}`} className="v-voltar">← Holos {caminho.nome}</Link>
          <div className="v-curso-selos">
            <span className="v-selo">{curso.kiwify ? 'Inscrições abertas' : 'Em breve'}</span>
            {curso.primeiro && <span className="v-selo v-selo-linha">Primeiros lançamentos</span>}
          </div>
          <h1 className="v-titulo-pagina">{curso.titulo}</h1>
          {curso.subtitulo && <p className="v-curso-subtitulo">{curso.subtitulo}</p>}
          {curso.apresenta && <p className="v-curso-apresenta">Apresentação: {curso.apresenta}</p>}
        </div>
      </section>

      <section className="v-secao">
        <div className="v-container v-curso-grade">
          <div className="v-curso-corpo">
            {curso.descricao ? (
              curso.descricao.map((p, i) => (
                <p key={i} className={i === 0 ? 'v-texto v-texto-destaque' : 'v-texto'}>{p}</p>
              ))
            ) : (
              <>
                <p className="v-texto v-texto-destaque">{curso.resumo}</p>
                <p className="v-texto">
                  A descrição completa, os módulos e as aulas deste curso serão publicados quando ele estiver pronto.
                </p>
              </>
            )}

            {curso.objetivos && (
              <>
                <h2 className="v-subtitulo">O que você vai trabalhar</h2>
                <ul className="v-lista-check">
                  {curso.objetivos.map((o) => <li key={o}>{o}</li>)}
                </ul>
              </>
            )}

            {curso.modulos && (
              <>
                <h2 className="v-subtitulo">Módulos</h2>
                <ol className="v-modulos">
                  {curso.modulos.map((m, i) => (
                    <li key={m}>
                      <span>{String(i).padStart(2, '0')}</span>
                      {m}
                    </li>
                  ))}
                </ol>
              </>
            )}

            {(curso.paraQuem || curso.paraQuemNao) && (
              <div className="v-para-quem">
                {curso.paraQuem && (
                  <div>
                    <h2 className="v-subtitulo">Para quem é</h2>
                    <p className="v-texto">{curso.paraQuem}</p>
                  </div>
                )}
                {curso.paraQuemNao && (
                  <div>
                    <h2 className="v-subtitulo">Para quem não é</h2>
                    <p className="v-texto">{curso.paraQuemNao}</p>
                  </div>
                )}
              </div>
            )}

            {curso.preRequisitos && (
              <>
                <h2 className="v-subtitulo">Pré-requisitos</h2>
                <p className="v-texto">{curso.preRequisitos}</p>
              </>
            )}
          </div>

          <aside className="v-curso-lateral">
            <div className="v-caixa">
              <p className="v-lista-titulo">Inscrição</p>
              {curso.kiwify ? (
                <a href={curso.kiwify} className="v-botao v-botao-cheio" target="_blank" rel="noreferrer">
                  Quero me inscrever
                </a>
              ) : (
                <>
                  <span className="v-botao v-botao-cheio v-botao-inativo" aria-disabled="true">Em breve</span>
                  <p className="v-pequeno">Valor e carga horária serão informados no lançamento.</p>
                </>
              )}
            </div>

            <div className="v-caixa">
              <p className="v-lista-titulo">O curso inclui</p>
              <ul className="v-lista-check v-lista-pequena">
                {METODOLOGIA.map((m) => <li key={m}>{m}</li>)}
              </ul>
            </div>

            <div className="v-caixa v-caixa-aviso">
              <p className="v-lista-titulo">Importante</p>
              <p className="v-pequeno">Curso livre de desenvolvimento pessoal, com certificado de conclusão.</p>
              {curso.introducaoTeorica && (
                <p className="v-pequeno">
                  Este curso é uma introdução e um aprofundamento teórico. Não é uma formação e não habilita para
                  atendimento clínico.
                </p>
              )}
              <p className="v-pequeno">Não substitui terapia nem tratamento de saúde.</p>
              <p className="v-pequeno">A narração da Almiah é feita com voz gerada por inteligência artificial.</p>
            </div>
          </aside>
        </div>
      </section>

      {relacionados.length > 0 && (
        <section className="v-secao v-secao-bege">
          <div className="v-container">
            <h2 className="v-titulo-secao">Outros cursos de Holos {caminho.nome}</h2>
            <div className="v-grade-cursos">
              {relacionados.map((c) => <CartaoCurso key={c.codigo} curso={c} />)}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

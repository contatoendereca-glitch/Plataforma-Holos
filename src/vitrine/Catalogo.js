import { useSearchParams } from 'react-router-dom'
import { CAMINHOS, CURSOS } from '../data/cursos'
import CartaoCurso from './CartaoCurso'

export default function Catalogo() {
  const [params, setParams] = useSearchParams()
  const filtro = CAMINHOS.some((c) => c.id === params.get('caminho')) ? params.get('caminho') : null

  const grupos = CAMINHOS.filter((c) => !filtro || c.id === filtro).map((c) => ({
    caminho: c,
    cursos: CURSOS.filter((x) => x.caminho === c.id).sort((a, b) => b.primeiro - a.primeiro),
  }))

  function escolher(id) {
    setParams(id ? { caminho: id } : {}, { replace: true })
  }

  return (
    <section className="v-secao v-secao-topo">
      <div className="v-container">
        <p className="v-sobretitulo">Catálogo</p>
        <h1 className="v-titulo-pagina">Cursos Holos</h1>
        <p className="v-texto v-texto-largo">
          Todos os cursos são livres, com certificado de conclusão, atividades, materiais complementares e a
          metodologia exclusiva Lente Holos. Os primeiros lançamentos estão em produção, e os demais chegam aos poucos.
        </p>

        <div className="v-filtros" role="group" aria-label="Filtrar por caminho">
          <button className={!filtro ? 'ativo' : ''} onClick={() => escolher(null)} aria-pressed={!filtro}>
            Todos
          </button>
          {CAMINHOS.map((c) => (
            <button
              key={c.id}
              className={filtro === c.id ? 'ativo' : ''}
              onClick={() => escolher(c.id)}
              aria-pressed={filtro === c.id}
            >
              {c.nome}
            </button>
          ))}
        </div>

        {grupos.map(({ caminho, cursos }) => (
          <div key={caminho.id} className="v-grupo">
            <div className="v-grupo-cabecalho">
              <h2>Holos {caminho.nome}</h2>
              <p>{caminho.lema}</p>
            </div>
            <div className="v-grade-cursos">
              {cursos.map((c) => (
                <CartaoCurso key={c.codigo} curso={c} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

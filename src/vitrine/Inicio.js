import { Link } from 'react-router-dom'
import { CURSOS, PRIMEIROS } from '../data/cursos'
import CartaoCurso from './CartaoCurso'
import CirculosHolos from './CirculosHolos'

export default function Inicio() {
  const primeiros = PRIMEIROS.map((c) => CURSOS.find((x) => x.codigo === c))

  return (
    <>
      <section
        className="h-abertura"
        aria-labelledby="titulo-abertura"
        style={{ '--img-madeira': "url('/img/home-madeira-1536.webp')" }}
      >
        <div className="v-container h-abertura-grade">
          <div className="h-abertura-texto">
            <h1 id="titulo-abertura" className="h-titulo">A direção é para dentro.</h1>
            <span className="h-traco" aria-hidden="true" />
            <p className="h-frase">Cursos de autoconhecimento e desenvolvimento humano</p>
          </div>
          <div className="h-circulos">
            <CirculosHolos />
          </div>
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

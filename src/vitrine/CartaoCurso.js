import { Link } from 'react-router-dom'

export default function CartaoCurso({ curso }) {
  return (
    <Link to={`/cursos/${curso.codigo.toLowerCase()}`} className="v-cartao-curso">
      <h3 className="v-cartao-titulo">{curso.titulo}</h3>
      <p className="v-cartao-resumo">{curso.resumo}</p>
      <span className={`v-selo ${curso.kiwify ? 'v-selo-aberto' : ''}`}>{curso.status}</span>
    </Link>
  )
}

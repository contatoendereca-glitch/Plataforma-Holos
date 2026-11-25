import { Link } from 'react-router-dom'
import { buscarCaminho } from '../data/cursos'

export default function CartaoCurso({ curso, destaque = false }) {
  const caminho = buscarCaminho(curso.caminho)
  return (
    <Link
      to={`/cursos/${curso.codigo.toLowerCase()}`}
      className={`v-cartao-curso caminho-${curso.caminho} ${destaque ? 'destaque' : ''}`}
    >
      <div className="v-cartao-topo">
        <span className="v-cartao-caminho">{caminho.nome}</span>
        <span className="v-selo">{curso.kiwify ? 'Inscrições abertas' : 'Em breve'}</span>
      </div>
      <h3 className="v-cartao-titulo">{curso.titulo}</h3>
      {destaque && curso.subtitulo && <p className="v-cartao-subtitulo">{curso.subtitulo}</p>}
      <p className="v-cartao-resumo">{curso.resumo}</p>
      <span className="v-cartao-mais">Conhecer o curso →</span>
    </Link>
  )
}

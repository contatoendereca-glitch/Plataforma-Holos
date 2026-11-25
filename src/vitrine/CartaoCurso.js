import { Link } from 'react-router-dom'
import { buscarCaminho } from '../data/cursos'

export default function CartaoCurso({ curso }) {
  const frente = curso.integracao ? buscarCaminho('integracao') : buscarCaminho(curso.frentes[0])
  return (
    <Link to={`/cursos/${curso.codigo.toLowerCase()}`} className="v-cartao-curso">
      <div className={`v-capa ${curso.capa ? '' : 'v-capa-padrao'}`}>
        {curso.capa ? (
          <img src={curso.capa} alt="" loading="lazy" width="390" height="172" />
        ) : (
          <>
            <img src="/img/medalhao-arvore.webp" alt="" loading="lazy" className="v-capa-arvore" />
            <span className="v-capa-frente">{frente.nome}</span>
          </>
        )}
      </div>
      <div className="v-cartao-corpo">
        <h3 className="v-cartao-titulo">{curso.titulo}</h3>
        <p className="v-cartao-resumo">{curso.resumo}</p>
        {curso.status && (
          <span className={`v-selo ${curso.kiwify ? 'v-selo-aberto' : ''}`}>{curso.status}</span>
        )}
      </div>
    </Link>
  )
}

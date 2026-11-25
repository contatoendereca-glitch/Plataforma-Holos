import { Link } from 'react-router-dom'

export default function NaoEncontrada() {
  return (
    <section className="v-secao v-secao-topo">
      <div className="v-container v-centro">
        <h1 className="v-titulo-pagina">Página não encontrada</h1>
        <p className="v-texto">O endereço pode ter mudado. Que tal recomeçar pelo início?</p>
        <p><Link to="/" className="v-botao">Voltar ao início</Link></p>
      </div>
    </section>
  )
}

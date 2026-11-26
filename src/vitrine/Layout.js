import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ReactComponent as HolosLogo } from '../assets/holos-logo.svg'
import Almiah from './Almiah'

const MENU = [
  { to: '/', rotulo: 'Início', fim: true },
  { to: '/cursos', rotulo: 'Cursos' },
  { to: '/sobre', rotulo: 'Sobre' },
  { to: '/parceiros', rotulo: 'Profissionais Parceiros' },
]

export function Marca({ tamanho = 36 }) {
  return (
    <span className="marca">
      <HolosLogo width={tamanho} height={tamanho} aria-hidden="true" />
      <span className="marca-texto">
        <span className="marca-plataforma">Plataforma</span>
        <span className="marca-holos">HOLOS</span>
      </span>
    </span>
  )
}

export default function Layout() {
  const { pathname } = useLocation()
  const [menuAberto, setMenuAberto] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    setMenuAberto(false)
  }, [pathname])

  return (
    <div className="v-site">
      <header className={`v-topo ${pathname === '/' ? 'v-topo-escuro' : ''}`}>
        <div className="v-container v-topo-linha">
          <Link to="/" className="v-topo-marca" aria-label="Plataforma Holos, página inicial">
            <img src="/img/arvore-marca.webp" alt="" width="34" height="34" className="v-topo-arvore" />
            Plataforma Holos
          </Link>
          <span className="v-topo-divisor" aria-hidden="true" />
          <button
            className="v-menu-botao"
            aria-expanded={menuAberto}
            aria-controls="menu-principal"
            onClick={() => setMenuAberto((v) => !v)}
          >
            {menuAberto ? 'Fechar' : 'Menu'}
          </button>
          <nav id="menu-principal" aria-label="Principal" className={`v-menu ${menuAberto ? 'aberto' : ''}`}>
            {MENU.map((m) => (
              <NavLink key={m.to} to={m.to} end={m.fim}>
                {m.rotulo}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className={pathname === '/' || pathname === '/cursos' ? '' : 'v-secundaria'}>
        <Outlet />
      </main>

      <footer className="v-rodape">
        <div className="v-container">
          <div className="v-rodape-grade">
            <div>
              <Marca tamanho={34} />
              <p className="v-rodape-lema">Direção para dentro.</p>
            </div>
            <nav className="v-rodape-links" aria-label="Links do rodapé">
              <Link to="/cursos">Cursos</Link>
              <Link to="/sobre">Sobre</Link>
              <Link to="/metodo">O Método Holos</Link>
              <Link to="/parceiros">Profissionais Parceiros</Link>
              <Link to="/privacidade">Privacidade</Link>
              <a href="https://instagram.com/psi.fernandalima_" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://www.youtube.com/@psicanalista.fernandalima" target="_blank" rel="noreferrer">YouTube</a>
            </nav>
          </div>
          <p className="v-rodape-aviso">
            Os cursos da Plataforma Holos são cursos livres de desenvolvimento pessoal, com certificado de conclusão.
            Não substituem terapia nem tratamento de saúde. A narração da Almiah é feita com voz gerada por
            inteligência artificial.
          </p>
          <p className="v-rodape-copy">© {new Date().getFullYear()} Plataforma Holos</p>
        </div>
      </footer>
      <Almiah />
    </div>
  )
}

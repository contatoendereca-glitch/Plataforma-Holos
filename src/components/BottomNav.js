import { NavLink } from 'react-router-dom'

const ITENS = [
  { to: '/', label: 'Hoje', icon: '🕊️', end: true },
  { to: '/cuidado', label: 'Cuidado', icon: '🫀' },
  { to: '/evolucao', label: 'Evolução', icon: '📈' },
  { to: '/comunidade', label: 'Comunidade', icon: '👥' },
  { to: '/perfil', label: 'Conta', icon: '⚙️' },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {ITENS.map(item => (
        <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span style={{ fontSize: '16px' }}>{item.icon}</span>
          <span style={{ fontSize: '10px' }}>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

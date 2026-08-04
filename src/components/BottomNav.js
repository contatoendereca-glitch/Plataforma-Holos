import { NavLink } from 'react-router-dom'

const ITENS = [
  { to: '/', label: 'Reflexão', icon: '🌅', end: true },
  { to: '/checkin', label: 'Check-in', icon: '✓' },
  { to: '/home', label: 'Home', icon: '🏠' },
  { to: '/premium', label: 'Premium', icon: '👑' },
  { to: '/perfil', label: 'Perfil', icon: '👤' },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {ITENS.map(item => (
        <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span style={{ fontSize: '16px' }}>{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
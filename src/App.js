import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ReflexaoDiaria from './pages/ReflexaoDiaria'
import Checkin from './pages/Checkin'
import Home from './pages/Home'
import Premium from './pages/Premium'
import Perfil from './pages/Perfil'
import Login from './pages/Login'
import BottomNav from './components/BottomNav'
import './styles/global.css'

function AppRoutes() {
  const { user, loading, isPremium } = useAuth()

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    )
  }

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    )
  }

  return (
    <div className="app-layout">
      <header className="topbar">
        <div className="topbar-logo">
          <div className="topbar-logo-text">
            <span className="topbar-logo-plataforma">PLATAFORMA</span>
            <span className="topbar-logo-holos">HOLOS</span>
          </div>
        </div>
        {isPremium && <span className="badge-premium">👑 Premium</span>}
      </header>

      <Routes>
        <Route path="/" element={<ReflexaoDiaria />} />
        <Route path="/checkin" element={<Checkin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

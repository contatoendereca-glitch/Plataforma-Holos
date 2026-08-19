import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ReflexaoDiaria from './pages/ReflexaoDiaria'
import Cuidado from './pages/Cuidado'
import Checkin from './pages/Checkin'
import RegistroRapido from './pages/RegistroRapido'
import Dor from './pages/Dor'
import DorDetalhe from './pages/DorDetalhe'
import Evolucao from './pages/Evolucao'
import Calendario from './pages/Calendario'
import Mapa from './pages/Mapa'
import Avaliacao from './pages/Avaliacao'
import Comunidade from './pages/Comunidade'
import Rodas from './pages/Rodas'
import Clube from './pages/Clube'
import Profissionais from './pages/Profissionais'
import Loja from './pages/Loja'
import Premium from './pages/Premium'
import Perfil from './pages/Perfil'
import PainelProfissional from './pages/PainelProfissional'
import SejaProfissional from './pages/SejaProfissional'
import PainelAdmin from './pages/PainelAdmin'
import Login from './pages/Login'
import Sobre from './pages/Sobre'
import Privacidade from './pages/Privacidade'
import { ReactComponent as HolosLogo } from './assets/holos-logo.svg'
import BottomNav from './components/BottomNav'
import './styles/global.css'

function AppRoutes() {
  const { user, perfil, loading, isPremium, sair } = useAuth()

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="app-layout">
        <Routes>
          <Route path="/sobre" element={<Sobre />} />
        <Route path="/privacidade" element={<Privacidade />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    )
  }

  if (perfil?.suspenso) {
    return (
      <div className="app-layout">
        <div className="page-content">
          <h2 className="page-title">Conta suspensa</h2>
          <p className="page-subtitle">
            Sua conta na Plataforma Holos está temporariamente suspensa. Se você acredita que isso é um engano, entre em contato com a gente.
          </p>
          <button className="btn btn-outline" onClick={sair} style={{ marginTop: 16 }}>Sair</button>
        </div>
      </div>
    )
  }

  return (
    <div className="app-layout">
      <header className="topbar">
        <div className="topbar-logo">
          <HolosLogo width={32} height={32} />
          <div className="topbar-logo-text">
            <span className="topbar-logo-plataforma">PLATAFORMA</span>
            <span className="topbar-logo-holos">HOLOS</span>
          </div>
        </div>
        {isPremium && <span className="badge-premium">👑 Premium</span>}
      </header>

      <Routes>
        <Route path="/" element={<ReflexaoDiaria />} />

        <Route path="/cuidado" element={<Cuidado />} />
        <Route path="/checkin" element={<Checkin />} />
        <Route path="/registro" element={<RegistroRapido />} />
        <Route path="/dor" element={<Dor />} />
        <Route path="/dor/:id" element={<DorDetalhe />} />

        <Route path="/evolucao" element={<Evolucao />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/avaliacao" element={<Avaliacao />} />

        <Route path="/comunidade" element={<Comunidade />} />
        <Route path="/rodas" element={<Rodas />} />
        <Route path="/clube" element={<Clube />} />
        <Route path="/profissionais" element={<Profissionais />} />

        <Route path="/store" element={<Loja />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/painel-profissional" element={<PainelProfissional />} />
        <Route path="/seja-profissional" element={<SejaProfissional />} />
        <Route path="/admin" element={<PainelAdmin />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/privacidade" element={<Privacidade />} />

        <Route path="/home" element={<Navigate to="/" replace />} />
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

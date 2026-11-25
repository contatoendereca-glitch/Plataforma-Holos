// Etapa 1 — Vitrine pública (sem login).
// As telas antigas (check-in, diário, mapa, marketplace, loja, admin...) continuam
// guardadas em src/pages e serão reaproveitadas na Etapa 2 (área da aluna).
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './vitrine/Layout'
import Inicio from './vitrine/Inicio'
import Catalogo from './vitrine/Catalogo'
import CursoPagina from './vitrine/CursoPagina'
import Parceiros from './vitrine/Parceiros'
import Sobre from './vitrine/Sobre'
import Privacidade from './vitrine/Privacidade'
import NaoEncontrada from './vitrine/NaoEncontrada'
import './styles/vitrine.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/cursos" element={<Catalogo />} />
          <Route path="/cursos/:codigo" element={<CursoPagina />} />
          <Route path="/parceiros" element={<Parceiros />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/privacidade" element={<Privacidade />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/profissionais" element={<Navigate to="/parceiros" replace />} />
          <Route path="/seja-profissional" element={<Navigate to="/parceiros" replace />} />
          <Route path="*" element={<NaoEncontrada />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

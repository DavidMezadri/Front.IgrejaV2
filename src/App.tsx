import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import { EventModalProvider } from './contexts/EventModalContext'
import PageLayout from './components/templates/PageLayout/PageLayout'
import AdminLayout from './components/templates/AdminLayout/AdminLayout'
import Home from './pages/Home/Home'
import Calendar from './pages/Calendar/Calendar'
import Weekly from './pages/Weekly/Weekly'
import Ministries from './pages/Ministries/Ministries'
import Sermons from './pages/Sermons/Sermons'
import Bible from './pages/Bible/Bible'
import Announcements from './pages/Announcements/Announcements'
import Prayer from './pages/Prayer/Prayer'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import AdminHome from './pages/Admin/AdminHome'
import AdminEndpoints from './pages/Admin/AdminEndpoints'
import AdminPessoas from './pages/Admin/AdminPessoas'
import AdminFamilias from './pages/Admin/AdminFamilias'
import AdminTiposEvento from './pages/Admin/AdminTiposEvento'
import AdminEventos from './pages/Admin/AdminEventos'
import AdminPresencas from './pages/Admin/AdminPresencas'
import AdminUsuarios from './pages/Admin/AdminUsuarios'
import AdminConfiguracoes from './pages/Admin/AdminConfiguracoes'
import AdminTraducoes from './pages/Admin/AdminTraducoes'
import AdminVersiculos from './pages/Admin/AdminVersiculos'
import AdminCMS from './pages/Admin/AdminCMS'

export default function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <EventModalProvider>
      <HashRouter>
        <Routes>
          {/* Rotas do Admin */}
          <Route path="/admin/*" element={<AdminLayout theme={theme} toggleTheme={toggleTheme} />}>
            <Route index element={<AdminHome />} />
            <Route path="endpoints" element={<AdminEndpoints />} />
            <Route path="pessoas" element={<AdminPessoas />} />
            <Route path="familias" element={<AdminFamilias />} />
            <Route path="tipos-evento" element={<AdminTiposEvento />} />
            <Route path="eventos" element={<AdminEventos />} />
            <Route path="presencas" element={<AdminPresencas />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
            <Route path="configuracoes" element={<AdminConfiguracoes />} />
            <Route path="cms" element={<AdminCMS />} />
            <Route path="traducoes" element={<AdminTraducoes />} />
            <Route path="versiculos" element={<AdminVersiculos />} />
          </Route>

          {/* Rotas do Site Normal */}
          <Route path="/" element={<PageLayout theme={theme} toggleTheme={toggleTheme} />}>
            <Route index element={<Navigate to="/inicio" replace />} />
            <Route path="inicio"      element={<Home />} />
            <Route path="calendario"  element={<Calendar />} />
            <Route path="semanal"     element={<Weekly />} />
            <Route path="ministerios" element={<Ministries />} />
            <Route path="sermoes"     element={<Sermons />} />
            <Route path="biblia"      element={<Bible />} />
            <Route path="avisos"      element={<Announcements />} />
            <Route path="oracao"      element={<Prayer />} />
            <Route path="login"       element={<Login />} />
            <Route path="cadastro"    element={<Signup />} />
          </Route>
        </Routes>
      </HashRouter>
    </EventModalProvider>
  )
}

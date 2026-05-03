import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import { EventModalProvider } from './contexts/EventModalContext'
import PageLayout from './components/templates/PageLayout/PageLayout'
import Home from './pages/Home/Home'
import Calendar from './pages/Calendar/Calendar'
import Weekly from './pages/Weekly/Weekly'
import Ministries from './pages/Ministries/Ministries'
import Sermons from './pages/Sermons/Sermons'
import Bible from './pages/Bible/Bible'
import Announcements from './pages/Announcements/Announcements'
import Prayer from './pages/Prayer/Prayer'
import Login from './pages/Login/Login'
import Admin from './pages/Admin/Admin'

export default function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <EventModalProvider>
      <HashRouter>
        <Routes>
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
            <Route path="admin"       element={<Admin />} />
          </Route>
        </Routes>
      </HashRouter>
    </EventModalProvider>
  )
}

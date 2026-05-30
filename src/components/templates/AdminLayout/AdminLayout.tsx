import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { useEffect, useState } from 'react'
import * as Icons from '../../atoms/Icon/Icon'
import styles from './AdminLayout.module.css'

const ADMIN_SECTIONS = [
  { id: 'admin', path: '/admin', label: 'Dashboard', icon: Icons.HomeIcon },
  { id: 'cms', path: '/admin/cms', label: 'CMS', icon: Icons.EditIcon, desc: 'Editar conteúdo das páginas públicas' },
  { id: 'pessoas', path: '/admin/pessoas', label: 'Pessoas', icon: Icons.UsersIcon, desc: 'Gerenciar membros da comunidade' },
  { id: 'familias', path: '/admin/familias', label: 'Famílias', icon: Icons.UsersIcon, desc: 'Organizar famílias cadastradas' },
  { id: 'tiposEvento', path: '/admin/tipos-evento', label: 'Tipos de Evento', icon: Icons.CalendarIcon, desc: 'Categorias de eventos' },
  { id: 'eventos', path: '/admin/eventos', label: 'Eventos', icon: Icons.CalendarIcon, desc: 'Gerenciar calendário de eventos' },
  { id: 'presencas', path: '/admin/presencas', label: 'Presenças', icon: Icons.CheckIcon, desc: 'Registro de presença nos eventos' },
  { id: 'traducoes', path: '/admin/traducoes', label: 'Traduções', icon: Icons.BookIcon, desc: 'Gerenciar traduções da bíblia' },
  { id: 'versiculos', path: '/admin/versiculos', label: 'Versículos', icon: Icons.BookIcon, desc: 'Gerenciar versículos da bíblia' },
  { id: 'usuarios', path: '/admin/usuarios', label: 'Usuários', icon: Icons.LoginIcon, desc: 'Gerenciar acesso ao sistema' },
  { id: 'configuracoes', path: '/admin/configuracoes', label: 'Configurações', icon: Icons.SettingsIcon, desc: 'Ajustes gerais do sistema' },
  { id: 'endpoints', path: '/admin/endpoints', label: 'Endpoints', icon: Icons.SettingsIcon, desc: 'Configurar endpoints da API' },
]

export default function AdminLayout({ theme, toggleTheme }) {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!isAdmin) {
      navigate('/inicio')
    }
  }, [isAdmin, navigate])

  async function handleLogout() {
    await logout()
    navigate('/inicio')
  }

  const close = () => setOpen(false)
  const currentPath = location.pathname

  return (
    <div className={styles.container}>
      <button className={styles.burger} onClick={() => setOpen(o => !o)} aria-label="Menu">
        <Icons.MenuIcon size={20} />
      </button>
      {open && <div className={styles.scrim} onClick={close} />}

      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
        <div className={styles.header}>
          <div className={styles.brand}>Admin Panel</div>
          <div className={styles.userInfo}>
            <div className={styles.adminBadge}>
              <Icons.ShieldIcon size={20} />
            </div>
            <div className={styles.userDetails}>
              <div className={styles.userName}>{user?.nomeUsuario || user?.nome || 'Administrador'}</div>
              <div className={styles.userRole}>Administrador</div>
            </div>
          </div>
        </div>

        <nav className={styles.nav}>
          {ADMIN_SECTIONS.map(section => (
            <button
              key={section.id}
              className={`${styles.navItem} ${currentPath === section.path ? styles.active : ''}`}
              onClick={() => {
                navigate(section.path)
                close()
              }}
            >
              <section.icon size={18} />
              <span>{section.label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.footer}>
          <button className={styles.themeBtn} onClick={toggleTheme}>
            <span className={styles.icon}>
              {theme === 'dark' ? <Icons.SunIcon size={16} /> : <Icons.MoonIcon size={16} />}
            </span>
            <span>Tema {theme === 'dark' ? 'claro' : 'escuro'}</span>
          </button>
          <button
            className={styles.homeBtn}
            onClick={() => navigate('/inicio')}
            title="Voltar à página inicial"
          >
            <Icons.HomeIcon size={16} />
            <span>Página Inicial</span>
          </button>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <Icons.LogoutIcon size={16} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

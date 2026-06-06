import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import NavItem from '../../molecules/NavItem/NavItem'
import * as Icons from '../../atoms/Icon/Icon'
import { USER_TYPE_LABELS, TipoUsuarioEnum } from '../../../config/userTypes'
import styles from './Sidebar.module.css'

const GROUPS = [
  { title: "Navegação", items: [
    { to: "/inicio",     label: "Início",         icon: Icons.HomeIcon },
    { to: "/calendario", label: "Calendário",      icon: Icons.CalendarIcon },
    { to: "/semanal",    label: "Cultos",          icon: Icons.MusicIcon },
    { to: "/avisos",     label: "Avisos",          icon: Icons.MegaphoneIcon },
  ]},
  { title: "Comunidade", items: [
    { to: "/ministerios", label: "Ministérios",   icon: Icons.UsersIcon },
    { to: "/oracao",      label: "Oração",         icon: Icons.HeartIcon },
    { to: "/sermoes",     label: "Sermões",         icon: Icons.PlayIcon },
    { to: "/biblia",      label: "Bíblia",          icon: Icons.BookIcon },
  ]},
]

export default function Sidebar({ theme, toggleTheme, nomeIgreja = 'Igreja' }) {
  const [open, setOpen] = useState(false)
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const close = () => setOpen(false)

  async function handleLogout() {
    await logout()
    navigate('/inicio')
    close()
  }

  const accountItems = isAuthenticated ? [
    { to: "/oracao", label: "🙏 Pedir Oração", icon: Icons.HeartIcon, hidden: false },
    ...(isAdmin ? [{ to: "/admin", label: "Área Admin" }] : []),
    { label: "Sair", icon: Icons.LogoutIcon, onClick: handleLogout, isDanger: true },
  ] : [
    { to: "/login", label: "Entrar", icon: Icons.LoginIcon },
  ]

  return (
    <>
      <button className={styles.burger} onClick={() => setOpen(o => !o)} aria-label="Menu">
        <Icons.MenuIcon size={20} />
      </button>
      {open && <div className={styles.scrim} onClick={close} />}
      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
        <Link to="/inicio" className={styles.brand} onClick={close}>
          <span className={styles.brandMark}>CG</span>
          <span>
            <div className={styles.brandName}>{nomeIgreja}</div>
            <div className={styles.brandSub}>Desde 1996 · SP</div>
          </span>
        </Link>

        {isAuthenticated && user && (
          <div className={styles.userSection}>
            <div className={styles.userAvatar}>👤</div>
            <div className={styles.userName}>{user.nome || user.username}</div>
            <div className={styles.userRole}>
              {USER_TYPE_LABELS[user.tipoUsuario] || 'Membro'}
            </div>
          </div>
        )}

        <nav className={styles.nav}>
          {GROUPS.map(g => (
            <div className={styles.group} key={g.title}>
              <div className={styles.groupTitle}>{g.title}</div>
              {g.items.map(item => (
                <NavItem key={item.to} to={item.to} icon={item.icon} onClick={close}>
                  {item.label}
                </NavItem>
              ))}
            </div>
          ))}

          <div className={styles.group}>
            <div className={styles.groupTitle}>Conta</div>
            {accountItems.map((item, idx) => (
              item.to ? (
                <NavItem key={item.to} to={item.to} icon={item.icon} onClick={close}>
                  {item.label}
                </NavItem>
              ) : (
                <button
                  key={idx}
                  className={`${styles.accountBtn} ${item.isDanger ? styles.danger : ''}`}
                  onClick={item.onClick}
                >
                  <span className={styles.icon}>{item.icon ? <item.icon size={16} /> : '→'}</span>
                  {item.label}
                </button>
              )
            ))}
          </div>
        </nav>

        <div className={styles.foot}>
          <button className={styles.themeBtn} onClick={toggleTheme}>
            <span className={styles.icon}>
              {theme === 'dark' ? <Icons.SunIcon size={16} /> : <Icons.MoonIcon size={16} />}
            </span>
            <span>Tema {theme === 'dark' ? 'claro' : 'escuro'}</span>
          </button>
          <div className={styles.meta}>
            Próximo culto<br />
            <b>Dom · 09:00</b>
          </div>
        </div>
      </aside>
    </>
  )
}

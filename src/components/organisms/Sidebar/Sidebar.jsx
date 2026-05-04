import { useState } from 'react'
import { Link } from 'react-router-dom'
import NavItem from '../../molecules/NavItem/NavItem'
import * as Icons from '../../atoms/Icon/Icon'
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
  { title: "Conta", items: [
    { to: "/login", label: "Entrar",        icon: Icons.LoginIcon },
    { to: "/admin", label: "Painel admin",  icon: Icons.SettingsIcon },
  ]},
]

export default function Sidebar({ theme, toggleTheme, nomeIgreja = 'Igreja' }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

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

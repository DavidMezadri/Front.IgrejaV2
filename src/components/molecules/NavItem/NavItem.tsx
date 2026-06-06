import { NavLink } from 'react-router-dom'
import styles from './NavItem.module.css'

export default function NavItem({ to, icon: IconComponent, children, onClick }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `${styles.link}${isActive ? ` ${styles.active}` : ''}`}
      onClick={onClick}
    >
      {IconComponent && (
        <span className={styles.icon} aria-hidden="true">
          <IconComponent size={18} />
        </span>
      )}
      <span>{children}</span>
    </NavLink>
  )
}

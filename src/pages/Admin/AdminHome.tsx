import { useAuth } from '../../contexts/AuthContext'
import * as Icons from '../../components/atoms/Icon/Icon'
import styles from './Admin.module.css'

const ADMIN_CARDS = [
  {
    icon: Icons.UsersIcon,
    title: 'Pessoas',
    desc: 'Gerenciar membros da comunidade'
  },
  {
    icon: Icons.UsersIcon,
    title: 'Famílias',
    desc: 'Organizar famílias cadastradas'
  },
  {
    icon: Icons.CalendarIcon,
    title: 'Eventos',
    desc: 'Gerenciar calendário de eventos'
  },
  {
    icon: Icons.SettingsIcon,
    title: 'Endpoints',
    desc: 'Configurar endpoints da API'
  },
  {
    icon: Icons.LoginIcon,
    title: 'Usuários',
    desc: 'Gerenciar acesso ao sistema'
  },
  {
    icon: Icons.SettingsIcon,
    title: 'Configurações',
    desc: 'Ajustes gerais do sistema'
  }
]

export default function AdminHome() {
  const { user } = useAuth()
  const userName = user?.nomeUsuario || user?.nome || 'Administrador'

  return (
    <div className={styles.section}>
      <div className={styles.adminHeader}>
        <div className={styles.adminBadge}>
          <Icons.ShieldIcon size={24} />
          <span>Administrador</span>
        </div>
        <div className={styles.adminUser}>
          <span className={styles.adminUserLabel}>Bem-vindo,</span>
          <h3 className={styles.adminUserName}>{userName}</h3>
        </div>
      </div>

      <div className={styles.sectionHead} style={{ marginTop: '32px' }}>
        <div>
          <div className="eyebrow">Painel de Controle</div>
          <h2>Gerenciamento</h2>
        </div>
      </div>

      <div className={styles.cards}>
        {ADMIN_CARDS.map((item, idx) => (
          <div key={idx} className={styles.card}>
            <div className={styles.cardIcon}>
              <item.icon size={28} />
            </div>
            <div className={styles.cardContent}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

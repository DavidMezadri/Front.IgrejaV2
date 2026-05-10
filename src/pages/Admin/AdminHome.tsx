import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useDashboardData } from '../../hooks/useDashboardData'
import * as Icons from '../../components/atoms/Icon/Icon'
import {
  PresencasUltimoCulto,
  MediaPresencaPorEvento,
  HistoricoCadastros,
  PessoasPorFaltas
} from '../../components/organisms/DashboardCharts'
import styles from './Admin.module.css'
import chartStyles from '../../components/organisms/DashboardCharts/DashboardCharts.module.css'

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
  const {
    ultimoCulto,
    ultimoCultoChart,
    mediaPresencaPorEvento,
    historicosCadastros,
    pessoasPorFaltasChart,
    totalPessoas,
    totalPresencas
  } = useDashboardData()

  const [showCharts, setShowCharts] = useState(true)
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

      {showCharts ? (
        <>
          <div className={styles.sectionHead}>
            <div>
              <div className="eyebrow">Dashboard</div>
              <h2>Estatísticas de Presença</h2>
            </div>
            <button
              onClick={() => setShowCharts(false)}
              className={styles.toggleBtn}
            >
              Ver Gerenciamento
            </button>
          </div>

          <div className={chartStyles.statsRow}>
            <div className={chartStyles.statCard}>
              <div className={chartStyles.statValue}>{totalPessoas}</div>
              <div className={chartStyles.statLabel}>Total de Pessoas</div>
            </div>
            <div className={chartStyles.statCard}>
              <div className={chartStyles.statValue}>{totalPresencas}</div>
              <div className={chartStyles.statLabel}>Total de Presenças</div>
            </div>
            {ultimoCulto && (
              <div className={chartStyles.statCard}>
                <div className={chartStyles.statValue}>
                  {ultimoCultoChart[0].value}
                </div>
                <div className={chartStyles.statLabel}>Presentes no Último Culto</div>
              </div>
            )}
            {mediaPresencaPorEvento.length > 0 && (
              <div className={chartStyles.statCard}>
                <div className={chartStyles.statValue}>
                  {Math.round(
                    mediaPresencaPorEvento.reduce((sum, e) => sum + e.percentual, 0) /
                    mediaPresencaPorEvento.length
                  )}%
                </div>
                <div className={chartStyles.statLabel}>Média de Presença</div>
              </div>
            )}
          </div>

          <div className={chartStyles.chartsGrid}>
            {ultimoCulto && (
              <PresencasUltimoCulto
                data={ultimoCultoChart}
                ultimoCulto={ultimoCulto}
              />
            )}

            {mediaPresencaPorEvento.length > 0 && (
              <MediaPresencaPorEvento data={mediaPresencaPorEvento} />
            )}

            <div className={chartStyles.chartsFullWidth}>
              <HistoricoCadastros data={historicosCadastros} />
            </div>

            {pessoasPorFaltasChart.length > 0 && (
              <div className={chartStyles.chartsFullWidth}>
                <PessoasPorFaltas data={pessoasPorFaltasChart} />
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className={`${styles.sectionHead} ${styles.sectionMarginTop}`}>
            <div>
              <div className="eyebrow">Painel de Controle</div>
              <h2>Gerenciamento</h2>
            </div>
            <button
              onClick={() => setShowCharts(true)}
              className={styles.toggleBtn}
            >
              Ver Dashboard
            </button>
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
        </>
      )}
    </div>
  )
}

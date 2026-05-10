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

      <div className={styles.sectionHead}>
        <div>
          <div className="eyebrow">Dashboard</div>
          <h2>Estatísticas de Presença</h2>
        </div>
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
    </div>
  )
}

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import styles from './DashboardCharts.module.css'

interface MediaPresencaPorEventoProps {
  data: Array<{
    name: string
    presencas: number
    percentual: number
  }>
}

export function MediaPresencaPorEvento({ data }: MediaPresencaPorEventoProps) {
  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <div>
          <h3>Média de Presença por Evento</h3>
          <p className={styles.subtitle}>Últimos 12 eventos</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
          <XAxis dataKey="name" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip
            formatter={(value, name) => {
              if (name === 'presencas') return `${value} presentes`
              if (name === 'percentual') return `${value}%`
              return value
            }}
          />
          <Legend />
          <Bar dataKey="presencas" fill="#3b82f6" name="Presentes" />
          <Bar dataKey="percentual" fill="#10b981" name="%" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

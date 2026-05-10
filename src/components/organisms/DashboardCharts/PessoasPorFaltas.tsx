import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import styles from './DashboardCharts.module.css'

interface PessoasPorFaltasProps {
  data: Array<{
    range: string
    pessoas: number
  }>
}

export function PessoasPorFaltas({ data }: PessoasPorFaltasProps) {
  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <div>
          <h3>Pessoas por Número de Faltas</h3>
          <p className={styles.subtitle}>Distribuição de frequência</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
          <XAxis dataKey="range" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip formatter={(value) => `${value} pessoas`} />
          <Legend />
          <Bar dataKey="pessoas" fill="#f59e0b" name="Pessoas" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

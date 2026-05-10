import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import styles from './DashboardCharts.module.css'

interface HistoricoCadastrosProps {
  data: Array<{
    data: string
    pessoas: number
  }>
}

export function HistoricoCadastros({ data }: HistoricoCadastrosProps) {
  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <div>
          <h3>Histórico de Cadastros</h3>
          <p className={styles.subtitle}>Últimos 30 dias</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
          <XAxis dataKey="data" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip formatter={(value) => `${value} pessoas`} />
          <Legend />
          <Line
            type="monotone"
            dataKey="pessoas"
            stroke="#8b5cf6"
            dot={false}
            strokeWidth={2}
            name="Total cadastrado"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

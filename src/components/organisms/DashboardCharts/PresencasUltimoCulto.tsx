import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'
import styles from './DashboardCharts.module.css'

interface PresencasUltimoCultoProps {
  data: Array<{ name: string; value: number; fill: string }>
  ultimoCulto: any
}

export function PresencasUltimoCulto({ data, ultimoCulto }: PresencasUltimoCultoProps) {
  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <div>
          <h3>Presença no Último Culto</h3>
          {ultimoCulto && (
            <p className={styles.subtitle}>
              {new Date(ultimoCulto.dataEvento).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} pessoas`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

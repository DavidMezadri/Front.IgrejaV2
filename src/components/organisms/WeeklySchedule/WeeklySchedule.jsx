import { DATA } from '../../../data/mockData'
import styles from './WeeklySchedule.module.css'

export default function WeeklySchedule() {
  return (
    <div className={styles.week}>
      {DATA.semanal.map(c => (
        <div className={styles.col} key={c.dia}>
          <h4>
            {c.dia}
            <span className={styles.count}>{c.itens.length}</span>
          </h4>
          {c.itens.map((it, i) => (
            <div className={styles.item} key={i}>
              <div className={styles.hora}>{it.hora}</div>
              <div className={styles.titulo}>{it.titulo}</div>
              <div className={styles.local}>{it.local}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

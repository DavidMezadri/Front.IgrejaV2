import { fmtDataLonga } from '../../../utils/dateUtils'
import styles from './SermonCard.module.css'

export default function SermonCard({ sermon }) {
  return (
    <article className={styles.sermon}>
      <div className={styles.thumb}>
        <div className={styles.play}>▶</div>
      </div>
      <div className={styles.body}>
        <div className={styles.ref}>{sermon.referencia} · {sermon.serie}</div>
        <h3>{sermon.titulo}</h3>
        <div className={styles.meta}>
          <span>{sermon.pregador}</span>
          <span>·</span>
          <span>{fmtDataLonga(sermon.data)}</span>
          <span>·</span>
          <span>{sermon.duracao}</span>
        </div>
      </div>
    </article>
  )
}

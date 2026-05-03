import { pad } from '../../../utils/dateUtils'
import styles from './MinistryCard.module.css'

export default function MinistryCard({ ministry, index, total }) {
  return (
    <div className={styles.card}>
      <div className={styles.num}>{pad(index + 1)} / {pad(total)}</div>
      <h3>{ministry.nome}</h3>
      <p className={styles.desc}>{ministry.descricao}</p>
      <div className={styles.meta}>
        <div>Liderança: <b>{ministry.lider}</b></div>
        <div>Encontros: {ministry.encontro}</div>
      </div>
    </div>
  )
}

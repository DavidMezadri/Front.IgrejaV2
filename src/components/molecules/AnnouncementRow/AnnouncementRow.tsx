import { fmtDataLonga } from '../../../utils/dateUtils'
import styles from './AnnouncementRow.module.css'

export default function AnnouncementRow({ aviso }) {
  return (
    <div className={styles.row}>
      <div className={styles.date}>{fmtDataLonga(aviso.data)}</div>
      <div>
        <div className={styles.title}>{aviso.titulo}</div>
        <div className={styles.body}>{aviso.resumo}</div>
      </div>
      <span className="tag">{aviso.categoria}</span>
    </div>
  )
}

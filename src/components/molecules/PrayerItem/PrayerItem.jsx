import { fmtDataLonga } from '../../../utils/dateUtils'
import styles from './PrayerItem.module.css'

export default function PrayerItem({ item }) {
  return (
    <div className={styles.item}>
      <div className={styles.who}>
        <span>{item.pessoaNome}</span>
        <span>{fmtDataLonga(item.data)}</span>
      </div>
      <div className={styles.text}>{item.pedido}</div>
    </div>
  )
}

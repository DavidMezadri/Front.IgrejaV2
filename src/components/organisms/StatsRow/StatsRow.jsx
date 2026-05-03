import { DATA } from '../../../data/mockData'
import styles from './StatsRow.module.css'

export default function StatsRow() {
  return (
    <div className="container">
      <div className={styles.stats}>
        <div className={styles.item}>
          <div className={styles.num}>{DATA.eventos.length}</div>
          <div className={styles.lbl}>Eventos no mês</div>
        </div>
        <div className={styles.item}>
          <div className={styles.num}>{DATA.ministerios.length}</div>
          <div className={styles.lbl}>Ministérios ativos</div>
        </div>
        <div className={styles.item}>
          <div className={styles.num}>{DATA.familias.length}+</div>
          <div className={styles.lbl}>Famílias cadastradas</div>
        </div>
        <div className={styles.item}>
          <div className={styles.num}>28</div>
          <div className={styles.lbl}>Anos servindo</div>
        </div>
      </div>
    </div>
  )
}

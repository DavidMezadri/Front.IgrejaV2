import styles from './StatsRow.module.css'

export default function StatsRow({ totalEventos = 0, totalMinisterios = 0, totalFamilias = 0 }) {
  return (
    <div className="container">
      <div className={styles.stats}>
        <div className={styles.item}>
          <div className={styles.num}>{totalEventos}</div>
          <div className={styles.lbl}>Eventos no mês</div>
        </div>
        <div className={styles.item}>
          <div className={styles.num}>{totalMinisterios}</div>
          <div className={styles.lbl}>Ministérios ativos</div>
        </div>
        <div className={styles.item}>
          <div className={styles.num}>{totalFamilias}+</div>
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

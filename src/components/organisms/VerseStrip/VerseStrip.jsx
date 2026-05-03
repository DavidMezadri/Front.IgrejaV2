import { DATA } from '../../../data/mockData'
import styles from './VerseStrip.module.css'

export default function VerseStrip() {
  return (
    <section className={styles.strip}>
      <div className="container">
        <blockquote className={styles.quote}>"{DATA.versiculoDoDia.texto}"</blockquote>
        <cite className={styles.cite}>{DATA.versiculoDoDia.referencia}</cite>
      </div>
    </section>
  )
}

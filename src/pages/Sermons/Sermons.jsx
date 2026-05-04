import { useSermoes } from '../../hooks/useSermoes'
import SermonCard from '../../components/molecules/SermonCard/SermonCard'
import styles from './Sermons.module.css'

export default function Sermons() {
  const { data: sermoes = [] } = useSermoes()

  return (
    <section className="block" id="sermoes">
      <div className="container">
        <div className="block-head">
          <div>
            <div className="eyebrow">05 — Pregações</div>
            <h2>Últimos sermões</h2>
          </div>
          <a href="#" className="btn btn-ghost">Ver biblioteca <span className="arrow" /></a>
        </div>
        <div className={styles.grid}>
          {sermoes.map(s => (
            <SermonCard key={s.id} sermon={s} />
          ))}
        </div>
      </div>
    </section>
  )
}

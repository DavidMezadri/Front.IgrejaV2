import { DATA } from '../../data/mockData'
import MinistryCard from '../../components/molecules/MinistryCard/MinistryCard'
import styles from './Ministries.module.css'

export default function Ministries() {
  return (
    <section className="block" id="ministerios">
      <div className="container">
        <div className="block-head">
          <div>
            <div className="eyebrow">04 — Ministérios</div>
            <h2>Onde servir e crescer</h2>
          </div>
          <a href="#/oracao" className="btn btn-ghost">Quero participar <span className="arrow" /></a>
        </div>
        <div className={styles.grid}>
          {DATA.ministerios.map((m, i) => (
            <MinistryCard key={m.id} ministry={m} index={i} total={DATA.ministerios.length} />
          ))}
        </div>
      </div>
    </section>
  )
}

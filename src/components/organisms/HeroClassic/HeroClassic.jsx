import styles from './HeroClassic.module.css'

export default function HeroClassic() {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.grid}>
          <div>
            <div className="eyebrow">01 — Comunidade</div>
            <h1>Um lugar para encontrar a Cristo, a si mesmo, e ao próximo.</h1>
            <p className="lead" style={{ marginTop: 28 }}>
              Domingos às 9h e 19h. Estudos durante a semana, ministérios para todas as idades
              e uma comunidade que caminha junto.
            </p>
            <div className={styles.cta}>
              <a href="#/calendario" className="btn btn-primary">Ver calendário <span className="arrow" /></a>
              <a href="#/semanal" className="btn btn-ghost">Programação semanal</a>
            </div>
            <div className={styles.meta}>
              <span><b>Domingo</b> · 9h e 19h</span>
              <span><b>Quarta</b> · 19h30</span>
              <span><b>Quinta</b> · 20h</span>
              <span><b>Sábado</b> · 19h30 (jovens)</span>
            </div>
          </div>
          <div className={styles.art}>
            <div className={styles.stamp}>Templo<br />Principal</div>
            <span className={styles.label}>[ foto da congregação ]</span>
          </div>
        </div>
      </div>
    </section>
  )
}

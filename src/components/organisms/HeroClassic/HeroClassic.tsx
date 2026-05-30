import styles from './HeroClassic.module.css'

interface HeroClassicProps {
  titulo?: string
  subtitulo?: string
  textoApoio?: string
}

const DEFAULT_TITULO = 'Um lugar para encontrar a Cristo, a si mesmo, e ao próximo.'
const DEFAULT_SUBTITULO = 'Domingos às 9h e 19h. Estudos durante a semana, ministérios para todas as idades e uma comunidade que caminha junto.'

export default function HeroClassic({ titulo, subtitulo, textoApoio }: HeroClassicProps = {}) {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.grid}>
          <div>
            <div className="eyebrow">01 — Comunidade</div>
            <h1>{titulo || DEFAULT_TITULO}</h1>
            <p className="lead" style={{ marginTop: 28 }}>
              {subtitulo || DEFAULT_SUBTITULO}
            </p>
            {textoApoio && (
              <p className="lead" style={{ marginTop: 16, opacity: 0.8 }}>
                {textoApoio}
              </p>
            )}
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

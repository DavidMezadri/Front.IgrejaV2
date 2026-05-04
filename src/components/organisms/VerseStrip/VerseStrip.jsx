import styles from './VerseStrip.module.css'

export default function VerseStrip({ versiculo = { texto: '', referencia: '' } }) {
  return (
    <section className={styles.strip}>
      <div className="container">
        <blockquote className={styles.quote}>"{versiculo.texto}"</blockquote>
        <cite className={styles.cite}>{versiculo.referencia}</cite>
      </div>
    </section>
  )
}

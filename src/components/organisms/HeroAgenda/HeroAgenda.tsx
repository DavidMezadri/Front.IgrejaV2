import { useMemo } from 'react'
import { MESES_CURTO, fmtHora } from '../../../utils/dateUtils'
import styles from './HeroAgenda.module.css'

export default function HeroAgenda({ eventos = [] }) {
  const proximos = useMemo(() =>
    [...eventos]
      .filter(e => new Date(e.dataInicio) >= new Date())
      .sort((a, b) => new Date(a.dataInicio) - new Date(b.dataInicio))
      .slice(0, 4)
  , [eventos])

  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.grid}>
          <div>
            <div className="eyebrow">Comunidade da Graça</div>
            <h1>O que vem por aí na sua igreja.</h1>
            <p className="lead" style={{ marginTop: 24 }}>
              Uma agenda viva — cultos, estudos e encontros pensados para sustentar a vida
              cristã durante a semana inteira.
            </p>
            <div className={styles.cta}>
              <a href="#/calendario" className="btn btn-primary">Calendário completo <span className="arrow" /></a>
              <a href="#/oracao" className="btn btn-ghost">Pedir oração</a>
            </div>
          </div>
          <div className={styles.nextUp}>
            {proximos.map(ev => {
              const d = new Date(ev.dataInicio)
              return (
                <div className={styles.row} key={ev.id}>
                  <div className={styles.day}>
                    <div className={styles.d}>{d.getDate()}</div>
                    <div className={styles.m}>{MESES_CURTO[d.getMonth()]}</div>
                  </div>
                  <div className={styles.info}>
                    <div className={styles.ttl}>{ev.nome}</div>
                    <div className={styles.evMeta}>{ev.tipoEventoNome} · {ev.local}</div>
                  </div>
                  <div className={styles.time}>{fmtHora(ev.dataInicio)}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

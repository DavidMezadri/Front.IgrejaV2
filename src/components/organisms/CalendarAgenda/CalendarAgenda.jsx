import { useMemo } from 'react'
import { DATA } from '../../../data/mockData'
import { MESES_CURTO, fmtHora, tipoCor } from '../../../utils/dateUtils'
import styles from './CalendarAgenda.module.css'

export default function CalendarAgenda({ onPick }) {
  const grupos = useMemo(() => {
    const m = new Map()
    ;[...DATA.eventos]
      .sort((a, b) => new Date(a.dataInicio) - new Date(b.dataInicio))
      .forEach(e => {
        const d = new Date(e.dataInicio)
        const k = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
        if (!m.has(k)) m.set(k, { date: d, items: [] })
        m.get(k).items.push(e)
      })
    return [...m.values()]
  }, [])

  const DIAS_CURTO = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"]

  return (
    <div className={styles.container}>
      {grupos.map((g, i) => (
        <div key={i} className={`${styles.dayRow} ${i === 0 ? styles.first : ''}`}>
          <div className={styles.dateCol}>
            <div className={styles.dateNum}>{g.date.getDate()} {MESES_CURTO[g.date.getMonth()].toLowerCase()}</div>
            <div className={styles.dateDow}>{DIAS_CURTO[g.date.getDay()]}</div>
          </div>
          <div className={styles.eventsCol}>
            {g.items.map(ev => (
              <div key={ev.id} className={styles.ev} onClick={() => onPick(ev)}>
                <div className={styles.evTime}>{fmtHora(ev.dataInicio)}</div>
                <div>
                  <div className={styles.evName}>{ev.nome}</div>
                  <div className={styles.evLocal}>{ev.local}</div>
                </div>
                <span className="tag">
                  <span className="dot" style={{ background: tipoCor(ev.tipoEventoId) }} />
                  {ev.tipoEventoNome}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

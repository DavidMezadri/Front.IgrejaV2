import { useMemo } from 'react'
import { DIAS, fmtHora, tipoCor } from '../../../utils/dateUtils'
import styles from './CalendarMonth.module.css'

export default function CalendarMonth({ year, month, onPick, eventos = [] }) {
  const first = new Date(year, month, 1)
  const startWeekday = first.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevDays = new Date(year, month, 0).getDate()
  const cells = []

  for (let i = startWeekday - 1; i >= 0; i--)
    cells.push({ day: prevDays - i, muted: true, date: new Date(year, month - 1, prevDays - i) })

  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, muted: false, date: new Date(year, month, d) })

  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date
    const next = new Date(last); next.setDate(last.getDate() + 1)
    cells.push({ day: next.getDate(), muted: true, date: next })
  }

  const eventosPorDia = useMemo(() => {
    const map = {}
    eventos.forEach(e => {
      const d = new Date(e.dataInicio)
      const k = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
      ;(map[k] ||= []).push(e)
    })
    return map
  }, [eventos])

  const today = new Date()

  return (
    <div className={styles.grid}>
      {DIAS.map(d => (
        <div key={d} className={`${styles.cell} ${styles.head}`}>{d}</div>
      ))}
      {cells.map((c, i) => {
        const k = `${c.date.getFullYear()}-${c.date.getMonth()}-${c.date.getDate()}`
        const evs = eventosPorDia[k] || []
        const isToday = !c.muted && c.date.toDateString() === today.toDateString()
        return (
          <div
            key={i}
            className={[
              styles.cell,
              c.muted ? styles.muted : '',
              isToday ? styles.today : '',
              evs.length ? styles.hasEv : '',
            ].filter(Boolean).join(' ')}
          >
            <div className={styles.num}>{c.day}</div>
            {evs.slice(0, 3).map(ev => (
              <div
                key={ev.id}
                className={styles.ev}
                style={{ borderLeftColor: tipoCor(ev.tipoEventoId) }}
                onClick={() => onPick(ev)}
                title={ev.nome}
              >
                {fmtHora(ev.dataInicio)} · {ev.nome}
              </div>
            ))}
            {evs.length > 3 && <div className={styles.more}>+{evs.length - 3} mais</div>}
          </div>
        )
      })}
    </div>
  )
}

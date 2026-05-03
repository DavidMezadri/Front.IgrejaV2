import { useState, useEffect } from 'react'
import { DATA } from '../../data/mockData'
import { MESES, tipoCor } from '../../utils/dateUtils'
import { useEventModal } from '../../contexts/EventModalContext'
import CalendarMonth from '../../components/organisms/CalendarMonth/CalendarMonth'
import CalendarList from '../../components/organisms/CalendarList/CalendarList'
import CalendarAgenda from '../../components/organisms/CalendarAgenda/CalendarAgenda'

export default function Calendar() {
  const { openEvent } = useEventModal()
  const [ym, setYm] = useState({ y: 2026, m: 4 })
  const [view, setView] = useState('month')

  function shift(n) {
    const d = new Date(ym.y, ym.m + n, 1)
    setYm({ y: d.getFullYear(), m: d.getMonth() })
  }

  return (
    <section className="block" id="calendario">
      <div className="container">
        <div className="block-head">
          <div>
            <div className="eyebrow">02 — Calendário</div>
            <h2>Agenda da igreja</h2>
          </div>
          <div className="tabs">
            <button className={view === 'month'  ? 'active' : ''} onClick={() => setView('month')}>Mês</button>
            <button className={view === 'list'   ? 'active' : ''} onClick={() => setView('list')}>Lista</button>
            <button className={view === 'agenda' ? 'active' : ''} onClick={() => setView('agenda')}>Agenda</button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>
            {MESES[ym.m]} <em style={{ color: 'var(--fg-muted)', fontStyle: 'normal', fontWeight: 400 }}>{ym.y}</em>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="icon-btn" onClick={() => shift(-1)} aria-label="Mês anterior">‹</button>
            <button className="icon-btn" onClick={() => setYm({ y: 2026, m: 4 })}>Hoje</button>
            <button className="icon-btn" onClick={() => shift(1)} aria-label="Próximo mês">›</button>
          </div>
        </div>

        {view === 'month'  && <CalendarMonth year={ym.y} month={ym.m} onPick={openEvent} />}
        {view === 'list'   && <CalendarList onPick={openEvent} />}
        {view === 'agenda' && <CalendarAgenda onPick={openEvent} />}

        <div className="legend">
          {DATA.tiposEvento.map(t => (
            <span key={t.id}>
              <span className="dot" style={{ background: tipoCor(t.id) }} />
              {t.nome}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

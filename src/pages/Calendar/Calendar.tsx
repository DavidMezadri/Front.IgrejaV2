import { useState } from 'react'
import { MESES, tipoCor } from '../../utils/dateUtils'
import { useEventModal } from '../../contexts/EventModalContext'
import { useEventos } from '../../hooks/useEventos'
import { useTiposEvento } from '../../hooks/useTiposEvento'
import CalendarMonth from '../../components/organisms/CalendarMonth/CalendarMonth'
import CalendarList from '../../components/organisms/CalendarList/CalendarList'
import CalendarAgenda from '../../components/organisms/CalendarAgenda/CalendarAgenda'

export default function Calendar() {
  const { openEvent } = useEventModal()
  const [ym, setYm] = useState(() => {
    const d = new Date()
    return { y: d.getFullYear(), m: d.getMonth() }
  })
  const [view, setView] = useState('month')

  const filtroData = {
    dataInicio: new Date(ym.y, ym.m, 1).toISOString(),
    dataFim: new Date(ym.y, ym.m + 1, 0, 23, 59, 59).toISOString(),
  }

  const { data: eventos = [], isLoading, error } = useEventos(filtroData)
  const { data: tiposEvento = [] } = useTiposEvento()

  if (error) console.error('Erro ao carregar eventos:', error)

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

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
            {MESES[ym.m]} <em style={{ color: 'var(--fg-muted)', fontStyle: 'normal', fontWeight: 400 }}>{ym.y}</em>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <button className="icon-btn" onClick={() => shift(-1)} aria-label="Mês anterior">‹</button>
            <button className="icon-btn" style={{ minWidth: 70, padding: '8px 12px' }} onClick={() => { const d = new Date(); setYm({ y: d.getFullYear(), m: d.getMonth() }) }}>Hoje</button>
            <button className="icon-btn" onClick={() => shift(1)} aria-label="Próximo mês">›</button>
          </div>
        </div>

        {view === 'month'  && <CalendarMonth year={ym.y} month={ym.m} onPick={openEvent} eventos={eventos} />}
        {view === 'list'   && <CalendarList onPick={openEvent} eventos={eventos} />}
        {view === 'agenda' && <CalendarAgenda onPick={openEvent} eventos={eventos} />}

        <div className="legend">
          {tiposEvento.map(t => (
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

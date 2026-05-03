import { DATA } from '../../../data/mockData'
import { MESES_CURTO, fmtHora, tipoCor } from '../../../utils/dateUtils'
import styles from './CalendarList.module.css'

export default function CalendarList({ onPick }) {
  const eventos = [...DATA.eventos].sort((a, b) => new Date(a.dataInicio) - new Date(b.dataInicio))

  return (
    <div className={styles.list}>
      {eventos.map(ev => {
        const d = new Date(ev.dataInicio)
        return (
          <div className={styles.row} key={ev.id}>
            <div className={styles.when}>
              <div className={styles.d}>{d.getDate()}</div>
              <div className={styles.m}>{MESES_CURTO[d.getMonth()]}</div>
              <div className={styles.h}>{fmtHora(ev.dataInicio)}</div>
            </div>
            <div>
              <div className={styles.ttl}>{ev.nome}</div>
              <div className={styles.desc}>{ev.descricao}</div>
              <div className={styles.meta}>
                <span className="tag">
                  <span className="dot" style={{ background: tipoCor(ev.tipoEventoId) }} />
                  {ev.tipoEventoNome}
                </span>
                <span className="tag">📍 {ev.local}</span>
                {ev.requerInscricao && <span className="tag">Inscrição obrigatória</span>}
              </div>
            </div>
            <div className={styles.cta}>
              <a href="#" onClick={e => { e.preventDefault(); onPick(ev) }}>
                Detalhes <span className="arrow" />
              </a>
            </div>
          </div>
        )
      })}
    </div>
  )
}

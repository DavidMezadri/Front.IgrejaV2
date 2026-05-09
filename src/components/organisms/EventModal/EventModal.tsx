import { fmtDataLonga, fmtHora } from '../../../utils/dateUtils'
import styles from './EventModal.module.css'

export default function EventModal({ ev, onClose }) {
  if (!ev) return null
  return (
    <div className={styles.bg} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>×</button>
        <div className="eyebrow" style={{ marginBottom: 6 }}>{ev.tipoEventoNome}</div>
        <h2>{ev.nome}</h2>
        <div className={styles.row}>
          <span><b>📅</b> {fmtDataLonga(ev.dataInicio)}</span>
          <span><b>🕒</b> {fmtHora(ev.dataInicio)}{ev.dataFim ? ` – ${fmtHora(ev.dataFim)}` : ''}</span>
          <span><b>📍</b> {ev.local}</span>
        </div>
        <div className={styles.desc}>{ev.descricao}</div>
        <div className={styles.actions}>
          {ev.requerInscricao
            ? <a className="btn btn-primary" href="#">Fazer inscrição <span className="arrow" /></a>
            : <a className="btn btn-primary" href="#">Adicionar ao calendário <span className="arrow" /></a>}
          <button className="btn btn-ghost" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  )
}

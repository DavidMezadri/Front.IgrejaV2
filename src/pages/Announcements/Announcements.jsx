import { useAvisos } from '../../hooks/useAvisos'
import AnnouncementRow from '../../components/molecules/AnnouncementRow/AnnouncementRow'

export default function Announcements() {
  const { data: avisos = [] } = useAvisos()

  return (
    <section className="block" id="avisos">
      <div className="container">
        <div className="block-head">
          <div>
            <div className="eyebrow">07 — Mural</div>
            <h2>Avisos da congregação</h2>
          </div>
        </div>
        <div>
          {avisos.map(a => (
            <AnnouncementRow key={a.id} aviso={a} />
          ))}
        </div>
      </div>
    </section>
  )
}

import WeeklySchedule from '../../components/organisms/WeeklySchedule/WeeklySchedule'

export default function Weekly() {
  return (
    <section className="block" id="semanal">
      <div className="container">
        <div className="block-head">
          <div>
            <div className="eyebrow">03 — Cultos</div>
            <h2>Programação da semana</h2>
          </div>
          <p className="lead" style={{ margin: 0 }}>
            Encontros fixos. Sem inscrição.<br />Todos são bem-vindos.
          </p>
        </div>
        <WeeklySchedule />
      </div>
    </section>
  )
}

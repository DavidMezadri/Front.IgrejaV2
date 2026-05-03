import { useState } from 'react'
import { DATA } from '../../data/mockData'
import PrayerItem from '../../components/molecules/PrayerItem/PrayerItem'
import styles from './Prayer.module.css'

export default function Prayer() {
  const [items, setItems] = useState(DATA.oracoes)
  const [form, setForm] = useState({ nome: '', pedido: '', publico: true })

  function submit(e) {
    e.preventDefault()
    if (!form.pedido.trim()) return
    setItems([
      { id: Date.now(), pessoaNome: form.nome || 'Anônimo', pedido: form.pedido, data: new Date().toISOString(), publico: form.publico },
      ...items,
    ])
    setForm({ nome: '', pedido: '', publico: true })
  }

  return (
    <section className="block" id="oracao">
      <div className="container">
        <div className="block-head">
          <div>
            <div className="eyebrow">08 — Intercessão</div>
            <h2>Pedidos de oração</h2>
          </div>
          <p className="lead" style={{ margin: 0 }}>
            "Confessai as vossas culpas uns aos outros e orai uns pelos outros." Tg 5.16
          </p>
        </div>
        <div className={styles.layout}>
          <form className={styles.form} onSubmit={submit}>
            <div className={styles.row}>
              <div>
                <label>Seu nome (opcional)</label>
                <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} placeholder="Como gostaria de aparecer" />
              </div>
              <div>
                <label>Contato (opcional)</label>
                <input placeholder="email ou telefone" />
              </div>
            </div>
            <label>Seu pedido</label>
            <textarea value={form.pedido} onChange={e => setForm({ ...form, pedido: e.target.value })} placeholder="Compartilhe com a equipe pastoral..." />
            <div className={styles.check}>
              <input type="checkbox" id="pub" checked={form.publico} onChange={e => setForm({ ...form, publico: e.target.checked })} />
              <label htmlFor="pub" style={{ margin: 0, textTransform: 'none', letterSpacing: 0, fontSize: 14 }}>
                Tornar público no mural de oração
              </label>
            </div>
            <button className="btn btn-primary" type="submit">Enviar pedido <span className="arrow" /></button>
          </form>
          <div className={styles.list}>
            {items.filter(i => i.publico).map(i => (
              <PrayerItem key={i.id} item={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

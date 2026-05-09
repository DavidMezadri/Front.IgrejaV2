import { useState, useEffect } from 'react'
import eventosService from '../../services/eventosService'
import tiposEventoService from '../../services/tiposEventoService'
import Badge from '../../components/atoms/Badge/Badge'
import * as Icons from '../../components/atoms/Icon/Icon'
import styles from './Admin.module.css'
import endpointStyles from './AdminEndpoints.module.css'

export default function AdminEventos() {
  const [eventos, setEventos] = useState([])
  const [tipos, setTipos] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    dataInicio: '',
    dataFim: '',
    local: '',
    tipoEventoId: '',
    ativo: true
  })

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    setLoading(true)
    try {
      const [eventosData, tiposData] = await Promise.all([
        eventosService.list(),
        tiposEventoService.list()
      ])
      setEventos(eventosData)
      setTipos(tiposData)
    } catch (err) {
      console.error('Erro:', err)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setForm({ nome: '', descricao: '', dataInicio: '', dataFim: '', local: '', tipoEventoId: '', ativo: true })
    setEditingId(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.nome || !form.dataInicio) {
      alert('Preencha os campos obrigatórios')
      return
    }

    try {
      if (editingId) {
        await eventosService.update(editingId, form)
      } else {
        await eventosService.create(form)
      }
      await carregarDados()
      resetForm()
      setShowForm(false)
    } catch (err) {
      console.error('Erro:', err)
      alert('Erro ao salvar evento')
    }
  }

  async function handleDelete(id) {
    if (confirm('Tem certeza?')) {
      try {
        await eventosService.remove(id)
        await carregarDados()
      } catch (err) {
        alert('Erro ao deletar')
      }
    }
  }

  function handleEdit(evento) {
    setForm(evento)
    setEditingId(evento.id)
    setShowForm(true)
  }

  const getTipoName = (id) => tipos.find(t => t.id === id)?.nome || '—'
  const formatData = (data) => new Date(data).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' })

  if (loading) return <div style={{ padding: '28px' }}>Carregando...</div>

  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <div className="eyebrow">Gerenciamento</div>
          <h2>Eventos</h2>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
        >
          + Novo Evento
        </button>
      </div>

      {showForm && (
        <div className={endpointStyles.formCard}>
          <h3>{editingId ? 'Editar Evento' : 'Novo Evento'}</h3>
          <form onSubmit={handleSubmit} className={endpointStyles.form}>
            <div className={endpointStyles.formGroup}>
              <label>Nome *</label>
              <input
                type="text"
                value={form.nome}
                onChange={e => setForm({ ...form, nome: e.target.value })}
                required
              />
            </div>

            <div className={endpointStyles.formGroup}>
              <label>Descrição</label>
              <textarea
                value={form.descricao}
                onChange={e => setForm({ ...form, descricao: e.target.value })}
                rows="2"
              />
            </div>

            <div className={endpointStyles.row}>
              <div className={endpointStyles.formGroup}>
                <label>Data de Início *</label>
                <input
                  type="datetime-local"
                  value={form.dataInicio}
                  onChange={e => setForm({ ...form, dataInicio: e.target.value })}
                  required
                />
              </div>

              <div className={endpointStyles.formGroup}>
                <label>Data de Fim</label>
                <input
                  type="datetime-local"
                  value={form.dataFim}
                  onChange={e => setForm({ ...form, dataFim: e.target.value })}
                />
              </div>
            </div>

            <div className={endpointStyles.row}>
              <div className={endpointStyles.formGroup}>
                <label>Local</label>
                <input
                  type="text"
                  value={form.local}
                  onChange={e => setForm({ ...form, local: e.target.value })}
                />
              </div>

              <div className={endpointStyles.formGroup}>
                <label>Tipo de Evento</label>
                <select
                  value={form.tipoEventoId}
                  onChange={e => setForm({ ...form, tipoEventoId: e.target.value })}
                >
                  <option value="">Selecione...</option>
                  {tipos.map(t => (
                    <option key={t.id} value={t.id}>{t.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={endpointStyles.formGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={form.ativo}
                  onChange={e => setForm({ ...form, ativo: e.target.checked })}
                />
                Ativo
              </label>
            </div>

            <div className={endpointStyles.formActions}>
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Atualizar' : 'Adicionar'}
              </button>
              <button type="button" className="btn" onClick={() => { resetForm(); setShowForm(false) }}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={endpointStyles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Data</th>
              <th>Local</th>
              <th>Tipo</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map(e => (
              <tr key={e.id}>
                <td><b>{e.nome}</b></td>
                <td>{formatData(e.dataInicio)}</td>
                <td>{e.local || '—'}</td>
                <td>{getTipoName(e.tipoEventoId)}</td>
                <td><Badge variant={e.ativo ? 'ok' : 'danger'}>{e.ativo ? 'Ativo' : 'Inativo'}</Badge></td>
                <td style={{ textAlign: 'right' }}>
                  <button className={endpointStyles.actionBtn} onClick={() => handleEdit(e)} title="Editar">
                    <Icons.EditIcon size={16} />
                  </button>
                  <button className={`${endpointStyles.actionBtn} ${endpointStyles.danger}`} onClick={() => handleDelete(e.id)} title="Deletar">
                    <Icons.TrashIcon size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={endpointStyles.info}>
        <p><b>Total:</b> {eventos.length} eventos cadastrados</p>
        <p><b>Ativos:</b> {eventos.filter(e => e.ativo).length}</p>
      </div>
    </div>
  )
}

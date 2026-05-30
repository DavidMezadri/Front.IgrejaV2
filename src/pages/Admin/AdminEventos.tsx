import { useState, useEffect } from 'react'
import eventosService from '../../services/eventosService'
import tiposEventoService from '../../services/tiposEventoService'
import Select from '../../components/atoms/Select/Select'
import Badge from '../../components/atoms/Badge/Badge'
import * as Icons from '../../components/atoms/Icon/Icon'
import styles from './Admin.module.css'

interface EventoForm {
  nome: string
  descricao: string
  tipoEventoId: string
  dataInicio: string
  dataFim: string
  local: string
  capacidadeMaxima: string
  requerInscricao: boolean
}

interface Evento extends EventoForm {
  id?: number
  ativo?: boolean
}

interface TipoEvento {
  id: string | number
  nome: string
}

export default function AdminEventos() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [tipos, setTipos] = useState<TipoEvento[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<EventoForm>({
    nome: '',
    descricao: '',
    tipoEventoId: '',
    dataInicio: '',
    dataFim: '',
    local: '',
    capacidadeMaxima: '',
    requerInscricao: false,
  })

  function toDateTimeInputValue(value?: string) {
    if (!value) return ''
    return value.slice(0, 16)
  }

  function toIsoDateTime(value: string) {
    return value ? new Date(value).toISOString() : ''
  }

  function toPayload(values: EventoForm) {
    return {
      Nome: values.nome,
      Descricao: values.descricao || '',
      TipoEventoId: Number(values.tipoEventoId),
      DataInicio: toIsoDateTime(values.dataInicio),
      DataFim: values.dataFim ? toIsoDateTime(values.dataFim) : null,
      Local: values.local || null,
      CapacidadeMaxima: values.capacidadeMaxima ? Number(values.capacidadeMaxima) : null,
      RequerInscricao: values.requerInscricao,
    }
  }

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
    setForm({
      nome: '',
      descricao: '',
      tipoEventoId: '',
      dataInicio: '',
      dataFim: '',
      local: '',
      capacidadeMaxima: '',
      requerInscricao: false,
    })
    setEditingId(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form.nome || !form.dataInicio || !form.tipoEventoId) {
      alert('Preencha os campos obrigatórios')
      return
    }

    try {
      const payload = toPayload(form)
      if (editingId) {
        await eventosService.update(editingId, payload)
      } else {
        await eventosService.create(payload)
      }
      await carregarDados()
      resetForm()
      setShowForm(false)
    } catch (err) {
      console.error('Erro:', err)
      alert('Erro ao salvar evento')
    }
  }

  async function handleToggleAtivo(evento: Evento) {
    try {
      const payload = toPayload({
        nome: evento.nome,
        descricao: evento.descricao,
        tipoEventoId: String(evento.tipoEventoId),
        dataInicio: toDateTimeInputValue(evento.dataInicio),
        dataFim: toDateTimeInputValue(evento.dataFim),
        local: evento.local,
        capacidadeMaxima: String(evento.capacidadeMaxima || ''),
        requerInscricao: evento.requerInscricao,
      })
      payload.Ativo = !evento.ativo
      await eventosService.update(evento.id || 0, payload)
      await carregarDados()
    } catch (err) {
      console.error('Erro:', err)
      alert('Erro ao atualizar status')
    }
  }

  async function handleDelete(id: number) {
    if (confirm('Tem certeza?')) {
      try {
        await eventosService.remove(id)
        await carregarDados()
      } catch (err) {
        alert('Erro ao deletar')
      }
    }
  }

  function handleEdit(evento: Evento) {
    setForm({
      nome: evento.nome,
      descricao: evento.descricao || '',
      tipoEventoId: String(evento.tipoEventoId || ''),
      dataInicio: toDateTimeInputValue(evento.dataInicio),
      dataFim: toDateTimeInputValue(evento.dataFim),
      local: evento.local || '',
      capacidadeMaxima: String(evento.capacidadeMaxima || ''),
      requerInscricao: evento.requerInscricao || false,
    })
    setEditingId(evento.id || null)
    setShowForm(true)
    window.scrollTo(0, 0)
  }

  const getTipoName = (id: string | number | undefined) => tipos.find(t => t.id === id)?.nome || '—'
  const formatData = (data: string) => new Date(data).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' })

  if (loading) return <div className="p-16">Carregando...</div>

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
        <div className={styles.formCard}>
          <h3>{editingId ? 'Editar Evento' : 'Novo Evento'}</h3>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Nome *</label>
              <input
                type="text"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Descrição</label>
              <textarea
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Tipo de Evento *</label>
              <Select
                value={form.tipoEventoId}
                onChange={(e) => setForm({ ...form, tipoEventoId: e.target.value })}
                required
              >
                <option value="">Selecione...</option>
                {tipos.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nome}
                  </option>
                ))}
              </Select>
            </div>

            <div className={styles.formGroup}>
              <label>Data de Início *</label>
              <input
                type="datetime-local"
                value={form.dataInicio}
                onChange={(e) => setForm({ ...form, dataInicio: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Data de Fim</label>
              <input
                type="datetime-local"
                value={form.dataFim}
                onChange={(e) => setForm({ ...form, dataFim: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Local</label>
              <input
                type="text"
                value={form.local}
                onChange={(e) => setForm({ ...form, local: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Capacidade Máxima</label>
              <input
                type="number"
                value={form.capacidadeMaxima}
                onChange={(e) => setForm({ ...form, capacidadeMaxima: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={form.requerInscricao}
                  onChange={(e) => setForm({ ...form, requerInscricao: e.target.checked })}
                />
                Requer Inscrição
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Atualizar' : 'Adicionar'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => { resetForm(); setShowForm(false) }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Data</th>
              <th>Local</th>
              <th>Tipo</th>
              <th>Status</th>
              <th className={styles.actionsCell}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map(e => (
              <tr key={e.id}>
                <td><b>{e.nome}</b></td>
                <td>{formatData(e.dataInicio)}</td>
                <td>{e.local || '—'}</td>
                <td>{getTipoName(e.tipoEventoId)}</td>
                <td>
                  <button
                    className={styles.statusBtn}
                    onClick={() => handleToggleAtivo(e)}
                    title={e.ativo ? 'Desativar' : 'Ativar'}
                  >
                    <Badge variant={e.ativo ? 'ok' : 'danger'}>{e.ativo ? 'Ativo' : 'Inativo'}</Badge>
                  </button>
                </td>
                <td className={styles.actionsCell}>
                  <button className={styles.actionBtn} onClick={() => handleEdit(e)} title="Editar">
                    <Icons.EditIcon size={16} />
                  </button>
                  <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => handleDelete(e.id || 0)} title="Deletar">
                    <Icons.TrashIcon size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.info}>
        <p><b>Total:</b> {eventos.length} eventos cadastrados</p>
        <p><b>Ativos:</b> {eventos.filter(e => e.ativo).length}</p>
      </div>
    </div>
  )
}

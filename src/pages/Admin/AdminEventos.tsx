import { useState, useEffect } from 'react'
import eventosService from '../../services/eventosService'
import tiposEventoService from '../../services/tiposEventoService'
import GenericForm, { FormField } from '../../components/molecules/GenericForm/GenericForm'
import Badge from '../../components/atoms/Badge/Badge'
import * as Icons from '../../components/atoms/Icon/Icon'
import styles from './Admin.module.css'

interface Evento {
  id?: number
  nome: string
  descricao: string
  dataInicio: string
  dataFim: string
  local: string
  tipoEventoId: string
  ativo: boolean
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
  const [form, setForm] = useState<Evento>({
    nome: '',
    descricao: '',
    dataInicio: '',
    dataFim: '',
    local: '',
    tipoEventoId: '',
    ativo: true
  })

  const FORM_FIELDS: FormField[] = [
    { name: 'nome', label: 'Nome', type: 'text', required: true },
    { name: 'descricao', label: 'Descrição', type: 'textarea' },
    { name: 'dataInicio', label: 'Data de Início', type: 'datetime-local', required: true },
    { name: 'dataFim', label: 'Data de Fim', type: 'datetime-local' },
    { name: 'local', label: 'Local', type: 'text' },
    { name: 'tipoEventoId', label: 'Tipo de Evento', type: 'select', options: tipos },
    { name: 'ativo', label: 'Ativo', type: 'checkbox' },
  ]

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
    setForm(evento)
    setEditingId(evento.id || null)
    setShowForm(true)
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
        <GenericForm
          title={editingId ? 'Editar Evento' : 'Novo Evento'}
          fields={FORM_FIELDS}
          values={form}
          onValueChange={(updates) => setForm({ ...form, ...updates })}
          onSubmit={handleSubmit}
          onCancel={() => { resetForm(); setShowForm(false) }}
          submitLabel={editingId ? 'Atualizar' : 'Adicionar'}
          isEditing={!!editingId}
        />
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
                <td><Badge variant={e.ativo ? 'ok' : 'danger'}>{e.ativo ? 'Ativo' : 'Inativo'}</Badge></td>
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

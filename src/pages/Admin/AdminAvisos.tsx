import { useState, useEffect } from 'react'
import avisosService from '../../services/avisosService'
import Badge from '../../components/atoms/Badge/Badge'
import * as Icons from '../../components/atoms/Icon/Icon'
import styles from './Admin.module.css'

interface AvisoForm {
  titulo: string
  resumo: string
  conteudo: string
  data: string
  categoria: string
}

interface Aviso extends AvisoForm {
  id?: number
  ativo?: boolean
}

export default function AdminAvisos() {
  const [avisos, setAvisos] = useState<Aviso[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<AvisoForm>({
    titulo: '',
    resumo: '',
    conteudo: '',
    data: '',
    categoria: '',
  })

  function toDateTimeInputValue(value?: string) {
    if (!value) return ''
    return value.slice(0, 16)
  }

  function toIsoDateTime(value: string) {
    return value ? new Date(value).toISOString() : ''
  }

  function toPayload(values: AvisoForm) {
    return {
      Titulo: values.titulo,
      Resumo: values.resumo,
      Conteudo: values.conteudo || '',
      Data: toIsoDateTime(values.data),
      Categoria: values.categoria || '',
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    setLoading(true)
    try {
      const data = await avisosService.list()
      setAvisos(data)
    } catch (err) {
      console.error('Erro:', err)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setForm({
      titulo: '',
      resumo: '',
      conteudo: '',
      data: '',
      categoria: '',
    })
    setEditingId(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form.titulo || !form.resumo || !form.data) {
      alert('Preencha os campos obrigatórios')
      return
    }

    try {
      const payload = toPayload(form)
      if (editingId) {
        await avisosService.update(editingId, payload)
      } else {
        await avisosService.create(payload)
      }
      await carregarDados()
      resetForm()
      setShowForm(false)
    } catch (err) {
      console.error('Erro:', err)
      alert('Erro ao salvar aviso')
    }
  }

  async function handleToggleAtivo(aviso: Aviso) {
    try {
      const payload = toPayload({
        titulo: aviso.titulo,
        resumo: aviso.resumo,
        conteudo: aviso.conteudo,
        data: toDateTimeInputValue(aviso.data),
        categoria: aviso.categoria,
      })
      payload.Ativo = !aviso.ativo
      await avisosService.update(aviso.id || 0, payload)
      await carregarDados()
    } catch (err) {
      console.error('Erro:', err)
      alert('Erro ao atualizar status')
    }
  }

  async function handleDelete(id: number) {
    if (confirm('Tem certeza?')) {
      try {
        await avisosService.remove(id)
        await carregarDados()
      } catch (err) {
        alert('Erro ao deletar')
      }
    }
  }

  function handleEdit(aviso: Aviso) {
    setForm({
      titulo: aviso.titulo,
      resumo: aviso.resumo,
      conteudo: aviso.conteudo || '',
      data: toDateTimeInputValue(aviso.data),
      categoria: aviso.categoria || '',
    })
    setEditingId(aviso.id || null)
    setShowForm(true)
    window.scrollTo(0, 0)
  }

  const formatData = (data: string) => new Date(data).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' })

  if (loading) return <div className="p-16">Carregando...</div>

  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <div className="eyebrow">Gerenciamento</div>
          <h2>Avisos</h2>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
        >
          + Novo Aviso
        </button>
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <h3>{editingId ? 'Editar Aviso' : 'Novo Aviso'}</h3>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Título *</label>
              <input
                type="text"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                maxLength={200}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Resumo *</label>
              <input
                type="text"
                value={form.resumo}
                onChange={(e) => setForm({ ...form, resumo: e.target.value })}
                maxLength={500}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Conteúdo</label>
              <textarea
                value={form.conteudo}
                onChange={(e) => setForm({ ...form, conteudo: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Data *</label>
              <input
                type="datetime-local"
                value={form.data}
                onChange={(e) => setForm({ ...form, data: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Categoria</label>
              <input
                type="text"
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                maxLength={100}
              />
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
              <th>Título</th>
              <th>Data</th>
              <th>Categoria</th>
              <th>Status</th>
              <th className={styles.actionsCell}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {avisos.map(a => (
              <tr key={a.id}>
                <td><b>{a.titulo}</b></td>
                <td>{formatData(a.data)}</td>
                <td>{a.categoria || '—'}</td>
                <td>
                  <button
                    className={styles.statusBtn}
                    onClick={() => handleToggleAtivo(a)}
                    title={a.ativo ? 'Desativar' : 'Ativar'}
                  >
                    <Badge variant={a.ativo ? 'ok' : 'danger'}>{a.ativo ? 'Ativo' : 'Inativo'}</Badge>
                  </button>
                </td>
                <td className={styles.actionsCell}>
                  <button className={styles.actionBtn} onClick={() => handleEdit(a)} title="Editar">
                    <Icons.EditIcon size={16} />
                  </button>
                  <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => handleDelete(a.id || 0)} title="Deletar">
                    <Icons.TrashIcon size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.info}>
        <p><b>Total:</b> {avisos.length} avisos cadastrados</p>
        <p><b>Ativos:</b> {avisos.filter(a => a.ativo).length}</p>
      </div>
    </div>
  )
}

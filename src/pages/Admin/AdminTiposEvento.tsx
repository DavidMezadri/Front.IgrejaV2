import { useState, useEffect } from 'react'
import tiposEventoService from '../../services/tiposEventoService'
import Select from '../../components/atoms/Select/Select'
import Badge from '../../components/atoms/Badge/Badge'
import * as Icons from '../../components/atoms/Icon/Icon'
import styles from './Admin.module.css'

interface TipoEventoForm {
  nome: string
  descricao: string
  publicoAlvo: string
  requerPresenca: boolean
  ativo: boolean
}

interface TipoEvento extends TipoEventoForm {
  id?: number
}

const PUBLICO_ALVO_OPTIONS = [
  { id: 0, nome: 'Geral' },
  { id: 1, nome: 'Lideranças' },
  { id: 2, nome: 'Crianças' },
  { id: 3, nome: 'Jovens' },
  { id: 4, nome: 'Adultos' },
  { id: 5, nome: 'Idosos' },
]

const getPublicoAlvoLabel = (id: string | number | undefined) => {
  return PUBLICO_ALVO_OPTIONS.find(p => p.id === Number(id))?.nome || '—'
}

export default function AdminTiposEvento() {
  const [tipos, setTipos] = useState<TipoEvento[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<TipoEventoForm>({
    nome: '',
    descricao: '',
    publicoAlvo: '0',
    requerPresenca: false,
    ativo: true,
  })

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    setLoading(true)
    try {
      const data = await tiposEventoService.list()
      setTipos(data)
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
      publicoAlvo: '0',
      requerPresenca: false,
      ativo: true,
    })
    setEditingId(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form.nome) {
      alert('Preencha o nome do tipo de evento')
      return
    }

    try {
      const payload = {
        Nome: form.nome,
        Descricao: form.descricao || '',
        PublicoAlvo: Number(form.publicoAlvo),
        RequerPresenca: form.requerPresenca,
        Ativo: form.ativo,
      }

      if (editingId) {
        await tiposEventoService.update(editingId, payload)
      } else {
        await tiposEventoService.create(payload)
      }
      await carregarDados()
      resetForm()
      setShowForm(false)
    } catch (err) {
      console.error('Erro:', err)
      alert('Erro ao salvar tipo de evento')
    }
  }

  async function handleToggleAtivo(tipo: TipoEvento) {
    try {
      const payload = {
        Nome: tipo.nome,
        Descricao: tipo.descricao || '',
        PublicoAlvo: Number(tipo.publicoAlvo),
        RequerPresenca: tipo.requerPresenca,
        Ativo: !tipo.ativo,
      }
      await tiposEventoService.update(tipo.id || 0, payload)
      await carregarDados()
    } catch (err) {
      console.error('Erro:', err)
      alert('Erro ao atualizar status')
    }
  }

  async function handleDelete(id: number) {
    if (confirm('Tem certeza?')) {
      try {
        await tiposEventoService.remove(id)
        await carregarDados()
      } catch (err) {
        alert('Erro ao deletar')
      }
    }
  }

  function handleEdit(tipo: TipoEvento) {
    setForm({
      nome: tipo.nome,
      descricao: tipo.descricao || '',
      publicoAlvo: String(tipo.publicoAlvo || '0'),
      requerPresenca: tipo.requerPresenca || false,
      ativo: tipo.ativo !== undefined ? tipo.ativo : true,
    })
    setEditingId(tipo.id || null)
    setShowForm(true)
    window.scrollTo(0, 0)
  }

  if (loading) return <div className="p-16">Carregando...</div>

  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <div className="eyebrow">Gerenciamento</div>
          <h2>Tipos de Evento</h2>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
        >
          + Novo Tipo
        </button>
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <h3>{editingId ? 'Editar Tipo de Evento' : 'Novo Tipo de Evento'}</h3>
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
              <label>Público Alvo</label>
              <Select
                value={form.publicoAlvo}
                onChange={(e) => setForm({ ...form, publicoAlvo: e.target.value })}
              >
                {PUBLICO_ALVO_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.nome}
                  </option>
                ))}
              </Select>
            </div>

            <div className={styles.formGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={form.requerPresenca}
                  onChange={(e) => setForm({ ...form, requerPresenca: e.target.checked })}
                />
                Requer Presença
              </label>
            </div>

            <div className={styles.formGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={form.ativo}
                  onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
                />
                Ativo
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
              <th>Público Alvo</th>
              <th>Presença</th>
              <th>Status</th>
              <th className={styles.actionsCell}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {tipos.map(tipo => (
              <tr key={tipo.id}>
                <td><b>{tipo.nome}</b></td>
                <td>{getPublicoAlvoLabel(tipo.publicoAlvo)}</td>
                <td>{tipo.requerPresenca ? 'Sim' : 'Não'}</td>
                <td>
                  <button
                    className={styles.statusBtn}
                    onClick={() => handleToggleAtivo(tipo)}
                    title={tipo.ativo ? 'Desativar' : 'Ativar'}
                  >
                    <Badge variant={tipo.ativo ? 'ok' : 'danger'}>{tipo.ativo ? 'Ativo' : 'Inativo'}</Badge>
                  </button>
                </td>
                <td className={styles.actionsCell}>
                  <button className={styles.actionBtn} onClick={() => handleEdit(tipo)} title="Editar">
                    <Icons.EditIcon size={16} />
                  </button>
                  <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => handleDelete(tipo.id || 0)} title="Deletar">
                    <Icons.TrashIcon size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.info}>
        <p><b>Total:</b> {tipos.length} tipos cadastrados</p>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import traducaoService from '../../services/traducaoService'
import GenericForm, { FormField } from '../../components/molecules/GenericForm/GenericForm'
import Badge from '../../components/atoms/Badge/Badge'
import * as Icons from '../../components/atoms/Icon/Icon'
import styles from './Admin.module.css'

interface Traducao {
  id?: number
  nome: string
  abreviacao: string
  descricao: string
}

const FORM_FIELDS: FormField[] = [
  { name: 'nome', label: 'Nome da Tradução', type: 'text', required: true },
  { name: 'abreviacao', label: 'Abreviação', type: 'text', required: true },
  { name: 'descricao', label: 'Descrição', type: 'textarea' },
]

export default function AdminTraducoes() {
  const [traducoes, setTraducoes] = useState<Traducao[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<Traducao>({
    nome: '',
    abreviacao: '',
    descricao: ''
  })

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    setLoading(true)
    try {
      const data = await traducaoService.list()
      setTraducoes(data)
    } catch (err) {
      console.error('Erro ao carregar:', err)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setForm({ nome: '', abreviacao: '', descricao: '' })
    setEditingId(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form.nome || !form.abreviacao) {
      alert('Preencha os campos obrigatórios')
      return
    }

    try {
      if (editingId) {
        await traducaoService.update(editingId, form)
      } else {
        await traducaoService.create(form)
      }
      await carregarDados()
      resetForm()
      setShowForm(false)
    } catch (err) {
      console.error('Erro:', err)
      alert('Erro ao salvar tradução')
    }
  }

  async function handleDelete(id: number) {
    if (confirm('Tem certeza?')) {
      try {
        await traducaoService.remove(id)
        await carregarDados()
      } catch (err) {
        alert('Erro ao deletar')
      }
    }
  }

  function handleEdit(traducao: Traducao) {
    setForm(traducao)
    setEditingId(traducao.id || null)
    setShowForm(true)
    window.scrollTo(0, 0)
  }

  if (loading) return <div className="p-16">Carregando...</div>

  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <div className="eyebrow">Bíblia</div>
          <h2>Traduções</h2>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
        >
          + Nova Tradução
        </button>
      </div>

      {showForm && (
        <GenericForm
          title={editingId ? 'Editar Tradução' : 'Nova Tradução'}
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
              <th>Abreviação</th>
              <th>Descrição</th>
              <th className={styles.actionsCell}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {traducoes.map(t => (
              <tr key={t.id}>
                <td><b>{t.nome}</b></td>
                <td><Badge variant="info">{t.abreviacao}</Badge></td>
                <td>{t.descricao || '—'}</td>
                <td className={styles.actionsCell}>
                  <button className={styles.actionBtn} onClick={() => handleEdit(t)} title="Editar">
                    <Icons.EditIcon size={16} />
                  </button>
                  <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => handleDelete(t.id || 0)} title="Deletar">
                    <Icons.TrashIcon size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.info}>
        <p><b>Total:</b> {traducoes.length} traduções cadastradas</p>
      </div>
    </div>
  )
}

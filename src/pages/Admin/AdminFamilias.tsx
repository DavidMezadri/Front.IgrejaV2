import { useState, useEffect } from 'react'
import familiasService from '../../services/familiasService'
import GenericForm, { FormField } from '../../components/molecules/GenericForm/GenericForm'
import * as Icons from '../../components/atoms/Icon/Icon'
import styles from './Admin.module.css'

interface Familia {
  id?: number
  nomeFamilia: string
  observacoes: string
  membros?: any[]
}

const FORM_FIELDS: FormField[] = [
  { name: 'nomeFamilia', label: 'Nome da Família', type: 'text', required: true },
  { name: 'observacoes', label: 'Observações', type: 'textarea' },
]

export default function AdminFamilias() {
  const [familias, setFamilias] = useState<Familia[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<Familia>({ nomeFamilia: '', observacoes: '' })

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    setLoading(true)
    try {
      const data = await familiasService.list()
      setFamilias(data)
    } catch (err) {
      console.error('Erro:', err)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setForm({ nomeFamilia: '', observacoes: '' })
    setEditingId(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form.nomeFamilia) {
      alert('Preencha o nome da família')
      return
    }

    try {
      if (editingId) {
        await familiasService.update(editingId, form)
      } else {
        await familiasService.create(form)
      }
      await carregarDados()
      resetForm()
      setShowForm(false)
    } catch (err) {
      console.error('Erro:', err)
      alert('Erro ao salvar família')
    }
  }

  async function handleDelete(id: number) {
    if (confirm('Tem certeza?')) {
      try {
        await familiasService.remove(id)
        await carregarDados()
      } catch (err) {
        alert('Erro ao deletar')
      }
    }
  }

  function handleEdit(familia: Familia) {
    setForm(familia)
    setEditingId(familia.id || null)
    setShowForm(true)
  }

  if (loading) return <div className="p-16">Carregando...</div>

  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <div className="eyebrow">Gerenciamento</div>
          <h2>Famílias</h2>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
        >
          + Nova Família
        </button>
      </div>

      {showForm && (
        <GenericForm
          title={editingId ? 'Editar Família' : 'Nova Família'}
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
              <th>Membros</th>
              <th>Observações</th>
              <th className={styles.actionsCell}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {familias.map(f => (
              <tr key={f.id}>
                <td><b>{f.nomeFamilia}</b></td>
                <td>{f.membros?.length || 0} membros</td>
                <td>{f.observacoes || '—'}</td>
                <td className={styles.actionsCell}>
                  <button className={styles.actionBtn} onClick={() => handleEdit(f)} title="Editar">
                    <Icons.EditIcon size={16} />
                  </button>
                  <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => handleDelete(f.id || 0)} title="Deletar">
                    <Icons.TrashIcon size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.info}>
        <p><b>Total:</b> {familias.length} famílias cadastradas</p>
      </div>
    </div>
  )
}

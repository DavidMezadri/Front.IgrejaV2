import { useState, useEffect } from 'react'
import familiasService from '../../services/familiasService'
import pessoasService from '../../services/pessoasService'
import { AsyncSearchSelect } from '../../components/molecules/AsyncSearchSelect'
import * as Icons from '../../components/atoms/Icon/Icon'
import styles from './Admin.module.css'

interface Familia {
  id?: number
  nome: string
  observacoes?: string
  responsavelId?: number | null
  membros?: any[]
}

export default function AdminFamilias() {
  const [familias, setFamilias] = useState<Familia[]>([])
  const [pessoas, setPessoas] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<Familia>({ nome: '', observacoes: '', responsavelId: null })

  async function buscarPessoas(query: string) {
    try {
      // Se vazio, retorna todas as pessoas carregadas
      if (!query.trim()) {
        return pessoas.map((p: any) => ({ id: p.id, label: p.nome }))
      }
      // Se tem query, busca via API
      const results = await pessoasService.search(query)
      return results.map((p: any) => ({ id: p.id, label: p.nome }))
    } catch (err) {
      console.error('Erro ao buscar pessoas:', err)
      return []
    }
  }

  function toPayload(values: Familia) {
    return {
      Nome: values.nome,
      ResponsavelId: values.responsavelId || null,
      Observacoes: values.observacoes || '',
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    setLoading(true)
    try {
      const [familiasData, pessoasData] = await Promise.all([
        familiasService.list(),
        pessoasService.list(),
      ])
      setFamilias(familiasData)
      setPessoas(pessoasData)
    } catch (err) {
      console.error('Erro:', err)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setForm({ nome: '', observacoes: '', responsavelId: null })
    setEditingId(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form.nome) {
      alert('Preencha o nome da família')
      return
    }

    try {
      const payload = toPayload(form)
      if (editingId) {
        await familiasService.update(editingId, payload)
      } else {
        await familiasService.create(payload)
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
        <div className={styles.formCard}>
          <h3>{editingId ? 'Editar Família' : 'Nova Família'}</h3>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Nome da Família *</label>
              <input
                type="text"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <AsyncSearchSelect
                label="Responsável"
                placeholder="Buscar pessoa..."
                value={form.responsavelId || null}
                onChange={(value) => setForm({ ...form, responsavelId: value as number | null })}
                onSearch={buscarPessoas}
                minChars={0}
                initialOptions={pessoas.map(p => ({ id: p.id, label: p.nome }))}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Observações</label>
              <textarea
                value={form.observacoes}
                onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
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
              <th>Nome</th>
              <th>Membros</th>
              <th>Observações</th>
              <th className={styles.actionsCell}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {familias.map(f => (
              <tr key={f.id}>
                <td><b>{f.nome}</b></td>
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

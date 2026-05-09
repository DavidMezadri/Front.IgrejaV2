import { useState, useEffect } from 'react'
import familiasService from '../../services/familiasService'
import pessoasService from '../../services/pessoasService'
import * as Icons from '../../components/atoms/Icon/Icon'
import styles from './Admin.module.css'
import endpointStyles from './AdminEndpoints.module.css'

export default function AdminFamilias() {
  const [familias, setFamilias] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ nomeFamilia: '', observacoes: '' })

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

  async function handleSubmit(e) {
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

  async function handleDelete(id) {
    if (confirm('Tem certeza?')) {
      try {
        await familiasService.remove(id)
        await carregarDados()
      } catch (err) {
        alert('Erro ao deletar')
      }
    }
  }

  function handleEdit(familia) {
    setForm(familia)
    setEditingId(familia.id)
    setShowForm(true)
  }

  if (loading) return <div style={{ padding: '28px' }}>Carregando...</div>

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
        <div className={endpointStyles.formCard}>
          <h3>{editingId ? 'Editar Família' : 'Nova Família'}</h3>
          <form onSubmit={handleSubmit} className={endpointStyles.form}>
            <div className={endpointStyles.formGroup}>
              <label>Nome da Família *</label>
              <input
                type="text"
                value={form.nomeFamilia}
                onChange={e => setForm({ ...form, nomeFamilia: e.target.value })}
                required
              />
            </div>

            <div className={endpointStyles.formGroup}>
              <label>Observações</label>
              <textarea
                value={form.observacoes}
                onChange={e => setForm({ ...form, observacoes: e.target.value })}
                rows="3"
              />
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
              <th>Membros</th>
              <th>Observações</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {familias.map(f => (
              <tr key={f.id}>
                <td><b>{f.nomeFamilia}</b></td>
                <td>{f.membros?.length || 0} membros</td>
                <td>{f.observacoes || '—'}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className={endpointStyles.actionBtn} onClick={() => handleEdit(f)} title="Editar">
                    <Icons.EditIcon size={16} />
                  </button>
                  <button className={`${endpointStyles.actionBtn} ${endpointStyles.danger}`} onClick={() => handleDelete(f.id)} title="Deletar">
                    <Icons.TrashIcon size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={endpointStyles.info}>
        <p><b>Total:</b> {familias.length} famílias cadastradas</p>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import pessoasService from '../../services/pessoasService'
import familiasService from '../../services/familiasService'
import Badge from '../../components/atoms/Badge/Badge'
import * as Icons from '../../components/atoms/Icon/Icon'
import styles from './Admin.module.css'
import endpointStyles from './AdminEndpoints.module.css'

export default function AdminPessoas() {
  const [pessoas, setPessoas] = useState([])
  const [familias, setFamilias] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    nome: '',
    dataNascimento: '',
    cpf: '',
    email: '',
    telefone: '',
    familiaId: '',
    ativo: true
  })

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    setLoading(true)
    try {
      const [pessoasData, familiasData] = await Promise.all([
        pessoasService.list(),
        familiasService.list()
      ])
      setPessoas(pessoasData)
      setFamilias(familiasData)
    } catch (err) {
      console.error('Erro ao carregar:', err)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setForm({ nome: '', dataNascimento: '', cpf: '', email: '', telefone: '', familiaId: '', ativo: true })
    setEditingId(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.nome || !form.email) {
      alert('Preencha os campos obrigatórios')
      return
    }

    try {
      if (editingId) {
        await pessoasService.update(editingId, form)
      } else {
        await pessoasService.create(form)
      }
      await carregarDados()
      resetForm()
      setShowForm(false)
    } catch (err) {
      console.error('Erro:', err)
      alert('Erro ao salvar pessoa')
    }
  }

  async function handleDelete(id) {
    if (confirm('Tem certeza?')) {
      try {
        await pessoasService.remove(id)
        await carregarDados()
      } catch (err) {
        alert('Erro ao deletar')
      }
    }
  }

  function handleEdit(pessoa) {
    setForm(pessoa)
    setEditingId(pessoa.id)
    setShowForm(true)
    window.scrollTo(0, 0)
  }

  const getFamiliaName = (id) => familias.find(f => f.id === id)?.nomeFamilia || '—'

  if (loading) return <div style={{ padding: '28px' }}>Carregando...</div>

  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <div className="eyebrow">Gerenciamento</div>
          <h2>Pessoas</h2>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
        >
          + Nova Pessoa
        </button>
      </div>

      {showForm && (
        <div className={endpointStyles.formCard}>
          <h3>{editingId ? 'Editar Pessoa' : 'Nova Pessoa'}</h3>
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

            <div className={endpointStyles.row}>
              <div className={endpointStyles.formGroup}>
                <label>E-mail *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className={endpointStyles.formGroup}>
                <label>Telefone</label>
                <input
                  type="tel"
                  value={form.telefone}
                  onChange={e => setForm({ ...form, telefone: e.target.value })}
                />
              </div>
            </div>

            <div className={endpointStyles.row}>
              <div className={endpointStyles.formGroup}>
                <label>CPF</label>
                <input
                  type="text"
                  value={form.cpf}
                  onChange={e => setForm({ ...form, cpf: e.target.value })}
                  placeholder="000.000.000-00"
                />
              </div>

              <div className={endpointStyles.formGroup}>
                <label>Data de Nascimento</label>
                <input
                  type="date"
                  value={form.dataNascimento}
                  onChange={e => setForm({ ...form, dataNascimento: e.target.value })}
                />
              </div>
            </div>

            <div className={endpointStyles.formGroup}>
              <label>Família</label>
              <select
                value={form.familiaId}
                onChange={e => setForm({ ...form, familiaId: e.target.value })}
              >
                <option value="">Selecione...</option>
                {familias.map(f => (
                  <option key={f.id} value={f.id}>{f.nomeFamilia}</option>
                ))}
              </select>
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
              <th>E-mail</th>
              <th>Família</th>
              <th>Telefone</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pessoas.map(p => (
              <tr key={p.id}>
                <td><b>{p.nome}</b></td>
                <td>{p.email}</td>
                <td>{getFamiliaName(p.familiaId)}</td>
                <td>{p.telefone || '—'}</td>
                <td><Badge variant={p.ativo ? 'ok' : 'danger'}>{p.ativo ? 'Ativo' : 'Inativo'}</Badge></td>
                <td style={{ textAlign: 'right' }}>
                  <button className={endpointStyles.actionBtn} onClick={() => handleEdit(p)} title="Editar">
                    <Icons.EditIcon size={16} />
                  </button>
                  <button className={`${endpointStyles.actionBtn} ${endpointStyles.danger}`} onClick={() => handleDelete(p.id)} title="Deletar">
                    <Icons.TrashIcon size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={endpointStyles.info}>
        <p><b>Total:</b> {pessoas.length} pessoas cadastradas</p>
        <p><b>Ativas:</b> {pessoas.filter(p => p.ativo).length}</p>
      </div>
    </div>
  )
}

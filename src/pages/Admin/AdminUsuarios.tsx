import { useState, useEffect } from 'react'
import usuariosService from '../../services/usuariosService'
import Badge from '../../components/atoms/Badge/Badge'
import * as Icons from '../../components/atoms/Icon/Icon'
import styles from './Admin.module.css'
import endpointStyles from './AdminEndpoints.module.css'

const ROLES = [
  { id: 0, nome: 'Administrador' },
  { id: 1, nome: 'Pastor' },
  { id: 2, nome: 'Presidente' },
  { id: 3, nome: 'Comissão' },
  { id: 4, nome: 'Membro' },
  { id: 5, nome: 'Visitante' },
]

interface Usuario {
  id: number
  nomeUsuario: string
  nome: string
  email: string
  tipoUsuario?: number | string
  ativo: boolean
  dataCriacao?: string
}

interface Form {
  nome: string
  email: string
  tipoUsuario: string
  ativo: boolean
}

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<Form>({
    nome: '',
    email: '',
    tipoUsuario: '4',
    ativo: true,
  })

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    setLoading(true)
    try {
      const data = await usuariosService.list()
      setUsuarios(data)
    } catch (err) {
      console.error('Erro:', err)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setForm({ nome: '', email: '', tipoUsuario: '4', ativo: true })
    setEditingId(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form.nome || !form.email) {
      alert('Preencha os campos obrigatórios')
      return
    }

    try {
      if (editingId) {
        await usuariosService.update(editingId, {
          nome: form.nome,
          email: form.email,
          tipoUsuario: parseInt(form.tipoUsuario),
          ativo: form.ativo,
        })
      }
      await carregarDados()
      resetForm()
      setShowForm(false)
    } catch (err) {
      console.error('Erro:', err)
      alert('Erro ao salvar usuário')
    }
  }

  async function handleDelete(id: number) {
    if (confirm('Tem certeza que deseja deletar este usuário?')) {
      try {
        await usuariosService.remove(id)
        await carregarDados()
      } catch (err) {
        alert('Erro ao deletar usuário')
      }
    }
  }

  function handleEdit(usuario: Usuario) {
    setForm({
      nome: usuario.nome,
      email: usuario.email,
      tipoUsuario: String(usuario.tipoUsuario || 4),
      ativo: usuario.ativo,
    })
    setEditingId(usuario.id)
    setShowForm(true)
    window.scrollTo(0, 0)
  }

  const getRoleName = (tipo: number | string | undefined) => {
    const role = ROLES.find(r => r.id === tipo)
    return role?.nome || '—'
  }

  if (loading) return <div style={{ padding: '28px' }}>Carregando...</div>

  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <div className="eyebrow">Gerenciamento</div>
          <h2>Usuários</h2>
        </div>
        <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
          Gerenciar acesso ao sistema
        </div>
      </div>

      {showForm && (
        <div className={endpointStyles.formCard}>
          <h3>{editingId ? 'Editar Usuário' : 'Novo Usuário'}</h3>
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
                <label>Papel</label>
                <select
                  value={form.tipoUsuario}
                  onChange={e => setForm({ ...form, tipoUsuario: e.target.value })}
                >
                  {ROLES.map(role => (
                    <option key={role.id} value={role.id}>{role.nome}</option>
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
              <th>Usuário</th>
              <th>E-mail</th>
              <th>Papel</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u: Usuario) => (
              <tr key={u.id}>
                <td><b>{u.nome}</b></td>
                <td><code style={{ fontSize: 12 }}>{u.nomeUsuario}</code></td>
                <td>{u.email}</td>
                <td>{getRoleName(u.tipoUsuario)}</td>
                <td><Badge variant={u.ativo ? 'ok' : 'danger'}>{u.ativo ? 'Ativo' : 'Inativo'}</Badge></td>
                <td style={{ textAlign: 'right' }}>
                  <button className={endpointStyles.actionBtn} onClick={() => handleEdit(u)} title="Editar">
                    <Icons.EditIcon size={16} />
                  </button>
                  <button className={`${endpointStyles.actionBtn} ${endpointStyles.danger}`} onClick={() => handleDelete(u.id)} title="Deletar">
                    <Icons.TrashIcon size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={endpointStyles.info}>
        <p><b>Total:</b> {usuarios.length} usuários cadastrados</p>
        <p><b>Ativos:</b> {usuarios.filter(u => u.ativo).length}</p>
      </div>
    </div>
  )
}

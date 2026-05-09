import { useState } from 'react'
import Badge from '../../components/atoms/Badge/Badge'
import * as Icons from '../../components/atoms/Icon/Icon'
import styles from './Admin.module.css'
import endpointStyles from './AdminEndpoints.module.css'

const ICON_MAP = {
  GET: Icons.DatabaseIcon,
  POST: Icons.DatabaseIcon,
  PUT: Icons.DatabaseIcon,
  DELETE: Icons.TrashIcon,
  PATCH: Icons.EditIcon
}

const INITIAL_ENDPOINTS = [
  { id: 1, nome: 'Listar Pessoas', metodo: 'GET', url: '/api/pessoas', ativo: true },
  { id: 2, nome: 'Criar Pessoa', metodo: 'POST', url: '/api/pessoas', ativo: true },
  { id: 3, nome: 'Atualizar Pessoa', metodo: 'PUT', url: '/api/pessoas/:id', ativo: true },
  { id: 4, nome: 'Deletar Pessoa', metodo: 'DELETE', url: '/api/pessoas/:id', ativo: true },
  { id: 5, nome: 'Listar Eventos', metodo: 'GET', url: '/api/eventos', ativo: true },
]

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']

export default function AdminEndpoints() {
  const [endpoints, setEndpoints] = useState(INITIAL_ENDPOINTS)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ nome: '', metodo: 'GET', url: '', ativo: true })

  function resetForm() {
    setForm({ nome: '', metodo: 'GET', url: '', ativo: true })
    setEditingId(null)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.nome || !form.url) {
      alert('Preencha todos os campos')
      return
    }

    if (editingId) {
      setEndpoints(endpoints.map(ep => ep.id === editingId ? { ...ep, ...form } : ep))
    } else {
      const newEndpoint = {
        id: Math.max(...endpoints.map(ep => ep.id), 0) + 1,
        ...form
      }
      setEndpoints([...endpoints, newEndpoint])
    }
    resetForm()
    setShowForm(false)
  }

  function handleEdit(endpoint) {
    setForm(endpoint)
    setEditingId(endpoint.id)
    setShowForm(true)
    window.scrollTo(0, 0)
  }

  function handleDelete(id) {
    if (confirm('Tem certeza que deseja deletar este endpoint?')) {
      setEndpoints(endpoints.filter(ep => ep.id !== id))
    }
  }

  function toggleAtivo(id) {
    setEndpoints(endpoints.map(ep =>
      ep.id === id ? { ...ep, ativo: !ep.ativo } : ep
    ))
  }

  const methodColor = {
    GET: 'ok',
    POST: 'info',
    PUT: 'warning',
    DELETE: 'danger',
    PATCH: 'info'
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <div className="eyebrow">Configuração · API</div>
          <h2>Endpoints</h2>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
        >
          + Novo Endpoint
        </button>
      </div>

      {showForm && (
        <div className={endpointStyles.formCard}>
          <h3>{editingId ? 'Editar Endpoint' : 'Novo Endpoint'}</h3>
          <form onSubmit={handleSubmit} className={endpointStyles.form}>
            <div className={endpointStyles.formGroup}>
              <label>Nome do Endpoint</label>
              <input
                type="text"
                value={form.nome}
                onChange={e => setForm({ ...form, nome: e.target.value })}
                placeholder="Ex: Listar Pessoas"
                required
              />
            </div>

            <div className={endpointStyles.row}>
              <div className={endpointStyles.formGroup}>
                <label>Método HTTP</label>
                <select
                  value={form.metodo}
                  onChange={e => setForm({ ...form, metodo: e.target.value })}
                >
                  {HTTP_METHODS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className={endpointStyles.formGroup}>
                <label>URL da API</label>
                <input
                  type="text"
                  value={form.url}
                  onChange={e => setForm({ ...form, url: e.target.value })}
                  placeholder="Ex: /api/pessoas"
                  required
                />
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
              <button
                type="button"
                className="btn"
                onClick={() => {
                  resetForm()
                  setShowForm(false)
                }}
              >
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
              <th>Método</th>
              <th>URL</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {endpoints.map(endpoint => (
              <tr key={endpoint.id}>
                <td><b>{endpoint.nome}</b></td>
                <td>
                  <Badge variant={methodColor[endpoint.metodo]}>
                    {endpoint.metodo}
                  </Badge>
                </td>
                <td><code style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{endpoint.url}</code></td>
                <td>
                  <button
                    className={endpointStyles.statusBtn}
                    onClick={() => toggleAtivo(endpoint.id)}
                    title={endpoint.ativo ? 'Desativar' : 'Ativar'}
                  >
                    <Badge variant={endpoint.ativo ? 'ok' : 'danger'}>
                      {endpoint.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </button>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    className={endpointStyles.actionBtn}
                    onClick={() => handleEdit(endpoint)}
                    title="Editar"
                  >
                    <Icons.EditIcon size={16} />
                  </button>
                  <button
                    className={`${endpointStyles.actionBtn} ${endpointStyles.danger}`}
                    onClick={() => handleDelete(endpoint.id)}
                    title="Deletar"
                  >
                    <Icons.TrashIcon size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={endpointStyles.info}>
        <p><b>Total:</b> {endpoints.length} endpoints cadastrados</p>
        <p><b>Ativos:</b> {endpoints.filter(ep => ep.ativo).length}</p>
      </div>
    </div>
  )
}

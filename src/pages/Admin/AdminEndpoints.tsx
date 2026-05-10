import { useState } from 'react'
import GenericForm, { FormField } from '../../components/molecules/GenericForm/GenericForm'
import Badge from '../../components/atoms/Badge/Badge'
import * as Icons from '../../components/atoms/Icon/Icon'
import styles from './Admin.module.css'

interface Endpoint {
  id?: number
  nome: string
  metodo: string
  url: string
  ativo: boolean
}

const INITIAL_ENDPOINTS: Endpoint[] = [
  { id: 1, nome: 'Listar Pessoas', metodo: 'GET', url: '/api/pessoas', ativo: true },
  { id: 2, nome: 'Criar Pessoa', metodo: 'POST', url: '/api/pessoas', ativo: true },
  { id: 3, nome: 'Atualizar Pessoa', metodo: 'PUT', url: '/api/pessoas/:id', ativo: true },
  { id: 4, nome: 'Deletar Pessoa', metodo: 'DELETE', url: '/api/pessoas/:id', ativo: true },
  { id: 5, nome: 'Listar Eventos', metodo: 'GET', url: '/api/eventos', ativo: true },
]

const HTTP_METHODS = [
  { id: 'GET', nome: 'GET' },
  { id: 'POST', nome: 'POST' },
  { id: 'PUT', nome: 'PUT' },
  { id: 'DELETE', nome: 'DELETE' },
  { id: 'PATCH', nome: 'PATCH' },
]

const FORM_FIELDS: FormField[] = [
  { name: 'nome', label: 'Nome do Endpoint', type: 'text', required: true },
  { name: 'metodo', label: 'Método HTTP', type: 'select', options: HTTP_METHODS },
  { name: 'url', label: 'URL da API', type: 'text', required: true },
  { name: 'ativo', label: 'Ativo', type: 'checkbox' },
]

export default function AdminEndpoints() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>(INITIAL_ENDPOINTS)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<Endpoint>({ nome: '', metodo: 'GET', url: '', ativo: true })

  function resetForm() {
    setForm({ nome: '', metodo: 'GET', url: '', ativo: true })
    setEditingId(null)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form.nome || !form.url) {
      alert('Preencha todos os campos')
      return
    }

    if (editingId) {
      setEndpoints(endpoints.map(ep => ep.id === editingId ? { ...ep, ...form } : ep))
    } else {
      const newEndpoint = {
        id: Math.max(...endpoints.map(ep => ep.id || 0), 0) + 1,
        ...form
      }
      setEndpoints([...endpoints, newEndpoint])
    }
    resetForm()
    setShowForm(false)
  }

  function handleEdit(endpoint: Endpoint) {
    setForm(endpoint)
    setEditingId(endpoint.id || null)
    setShowForm(true)
    window.scrollTo(0, 0)
  }

  function handleDelete(id: number) {
    if (confirm('Tem certeza que deseja deletar este endpoint?')) {
      setEndpoints(endpoints.filter(ep => ep.id !== id))
    }
  }

  function toggleAtivo(id: number) {
    setEndpoints(endpoints.map(ep =>
      ep.id === id ? { ...ep, ativo: !ep.ativo } : ep
    ))
  }

  const methodColor: Record<string, string> = {
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
        <GenericForm
          title={editingId ? 'Editar Endpoint' : 'Novo Endpoint'}
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
              <th>Método</th>
              <th>URL</th>
              <th>Status</th>
              <th className={styles.actionsCell}>Ações</th>
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
                <td><code className={styles.codeSmall}>{endpoint.url}</code></td>
                <td>
                  <button
                    className={styles.statusBtn}
                    onClick={() => toggleAtivo(endpoint.id || 0)}
                    title={endpoint.ativo ? 'Desativar' : 'Ativar'}
                  >
                    <Badge variant={endpoint.ativo ? 'ok' : 'danger'}>
                      {endpoint.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </button>
                </td>
                <td className={styles.actionsCell}>
                  <button
                    className={styles.actionBtn}
                    onClick={() => handleEdit(endpoint)}
                    title="Editar"
                  >
                    <Icons.EditIcon size={16} />
                  </button>
                  <button
                    className={`${styles.actionBtn} ${styles.danger}`}
                    onClick={() => handleDelete(endpoint.id || 0)}
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

      <div className={styles.info}>
        <p><b>Total:</b> {endpoints.length} endpoints cadastrados</p>
        <p><b>Ativos:</b> {endpoints.filter(ep => ep.ativo).length}</p>
      </div>
    </div>
  )
}

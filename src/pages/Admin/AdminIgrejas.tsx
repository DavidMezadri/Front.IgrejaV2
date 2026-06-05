import { useState, useEffect } from 'react'
import igrejaService, { Igreja } from '../../services/igrejaService'
import enderecoService, { Endereco } from '../../services/enderecoService'
import { useFormErrors } from '../../hooks/useFormErrors'
import { isValidEmail } from '../../utils/validators'
import { AsyncSearchSelect } from '../../components/molecules/AsyncSearchSelect'
import Badge from '../../components/atoms/Badge/Badge'
import * as Icons from '../../components/atoms/Icon/Icon'
import styles from './Admin.module.css'

interface IgrejaForm {
  nome: string
  email: string
  telefone: string
  enderecoId: string
  lema: string
  ativo: boolean
}

const defaultForm: IgrejaForm = {
  nome: '',
  email: '',
  telefone: '',
  enderecoId: '',
  lema: '',
  ativo: true,
}

export default function AdminIgrejas() {
  const [igrejas, setIgrejas] = useState<Igreja[]>([])
  const [enderecos, setEnderecos] = useState<Endereco[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<IgrejaForm>(defaultForm)
  const { errors, clearError, clearAll, validate } = useFormErrors<Record<string, string>>()

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    setLoading(true)
    try {
      const [igrejasData, enderecosData] = await Promise.all([
        igrejaService.list(),
        enderecoService.list()
      ])
      setIgrejas(igrejasData)
      setEnderecos(enderecosData)
    } catch (err) {
      console.error('Erro:', err)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setForm(defaultForm)
    setEditingId(null)
  }

  async function buscarEnderecos(query: string) {
    try {
      if (!query.trim()) {
        return enderecos.map(e => ({
          id: e.id,
          label: `${e.rua}, ${e.numero} - ${e.bairro}, ${e.cidade}/${e.estado}`
        }))
      }
      const results = await enderecoService.list()
      return results
        .filter((e: any) => {
          const fullAddress = `${e.rua} ${e.numero} ${e.bairro} ${e.cidade}`.toLowerCase()
          return fullAddress.includes(query.toLowerCase())
        })
        .map((e: any) => ({
          id: e.id,
          label: `${e.rua}, ${e.numero} - ${e.bairro}, ${e.cidade}/${e.estado}`
        }))
    } catch (err) {
      console.error('Erro ao buscar endereços:', err)
      return []
    }
  }

  const getEnderecoLabel = (id: number | undefined) => {
    const endereco = enderecos.find(e => e.id === id)
    if (!endereco) return '—'
    return `${endereco.rua}, ${endereco.numero} - ${endereco.bairro}, ${endereco.cidade}`
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const valido = validate([
      { field: 'nome', value: form.nome, required: true },
      { field: 'email', value: form.email, required: true, format: isValidEmail },
    ])

    if (!valido) return

    try {
      const payload: Igreja = {
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
        lema: form.lema,
        ativo: form.ativo,
        enderecoId: form.enderecoId === '' ? undefined : Number(form.enderecoId),
      }

      if (editingId) {
        await igrejaService.update(editingId, payload)
      } else {
        await igrejaService.create(payload)
      }
      await carregarDados()
      resetForm()
      clearAll()
      setShowForm(false)
    } catch (err) {
      console.error('Erro:', err)
      alert('Erro ao salvar igreja')
    }
  }

  async function handleToggleAtivo(igreja: Igreja) {
    try {
      const payload: Igreja = {
        nome: igreja.nome,
        email: igreja.email,
        telefone: igreja.telefone,
        lema: igreja.lema,
        ativo: !igreja.ativo,
        enderecoId: igreja.enderecoId,
      }
      await igrejaService.update(igreja.id || 0, payload)
      await carregarDados()
    } catch (err) {
      console.error('Erro:', err)
      alert('Erro ao atualizar status')
    }
  }

  async function handleDelete(id: number) {
    if (confirm('Tem certeza?')) {
      try {
        await igrejaService.remove(id)
        await carregarDados()
      } catch (err) {
        alert('Erro ao deletar')
      }
    }
  }

  function handleEdit(igreja: Igreja) {
    setForm({
      nome: igreja.nome,
      email: igreja.email,
      telefone: igreja.telefone || '',
      enderecoId: String(igreja.enderecoId || ''),
      lema: igreja.lema || '',
      ativo: igreja.ativo !== undefined ? igreja.ativo : true,
    })
    setEditingId(igreja.id || null)
    setShowForm(true)
    window.scrollTo(0, 0)
  }

  if (loading) return <div className="p-16">Carregando...</div>

  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <div className="eyebrow">Gerenciamento</div>
          <h2>Igrejas</h2>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
        >
          + Nova Igreja
        </button>
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <h3>{editingId ? 'Editar Igreja' : 'Nova Igreja'}</h3>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Nome *</label>
              <input
                type="text"
                value={form.nome}
                onChange={(e) => { clearError('nome'); setForm({ ...form, nome: e.target.value }) }}
                className={errors.nome ? styles.inputError : ''}
              />
              {errors.nome && <span className={styles.fieldError}>{errors.nome}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => { clearError('email'); setForm({ ...form, email: e.target.value }) }}
                className={errors.email ? styles.inputError : ''}
              />
              {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Telefone</label>
              <input
                type="tel"
                value={form.telefone}
                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              />
            </div>

            <div key="endereco-group" className={styles.formGroup}>
              <AsyncSearchSelect
                label="Endereço"
                placeholder="Buscar endereço..."
                value={form.enderecoId ? Number(form.enderecoId) : null}
                onChange={(value) => setForm({ ...form, enderecoId: value ? String(value) : '' })}
                onSearch={buscarEnderecos}
                minChars={0}
                initialOptions={enderecos.map(e => ({
                  id: e.id,
                  label: `${e.rua}, ${e.numero} - ${e.bairro}, ${e.cidade}/${e.estado}`
                }))}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Lema</label>
              <input
                type="text"
                value={form.lema}
                onChange={(e) => setForm({ ...form, lema: e.target.value })}
              />
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
              <th>Email</th>
              <th>Telefone</th>
              <th>Endereço</th>
              <th>Lema</th>
              <th>Status</th>
              <th className={styles.actionsCell}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {igrejas.map(igreja => (
              <tr key={igreja.id}>
                <td><b>{igreja.nome}</b></td>
                <td>{igreja.email}</td>
                <td>{igreja.telefone || '—'}</td>
                <td>{getEnderecoLabel(igreja.enderecoId)}</td>
                <td>{igreja.lema || '—'}</td>
                <td>
                  <button
                    className={styles.statusBtn}
                    onClick={() => handleToggleAtivo(igreja)}
                    title={igreja.ativo ? 'Desativar' : 'Ativar'}
                  >
                    <Badge variant={igreja.ativo ? 'ok' : 'danger'}>{igreja.ativo ? 'Ativo' : 'Inativo'}</Badge>
                  </button>
                </td>
                <td className={styles.actionsCell}>
                  <button className={styles.actionBtn} onClick={() => handleEdit(igreja)} title="Editar">
                    <Icons.EditIcon size={16} />
                  </button>
                  <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => handleDelete(igreja.id || 0)} title="Deletar">
                    <Icons.TrashIcon size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.info}>
        <p><b>Total:</b> {igrejas.length} Igreja(s) cadastrada(s)</p>
      </div>
    </div>
  )
}

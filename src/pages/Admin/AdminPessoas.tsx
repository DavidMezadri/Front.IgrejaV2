import { useState, useEffect } from 'react'
import pessoasService from '../../services/pessoasService'
import familiasService from '../../services/familiasService'
import { FormField } from '../../components/molecules/GenericForm/GenericForm'
import { AsyncSearchSelect } from '../../components/molecules/AsyncSearchSelect'
import Select from '../../components/atoms/Select/Select'
import Badge from '../../components/atoms/Badge/Badge'
import * as Icons from '../../components/atoms/Icon/Icon'
import styles from './Admin.module.css'

interface PessoaForm {
  nome: string
  dataNascimento: string
  sexo: string
  email: string
  telefone: string
  dataBatismo: string
  membroDesde: string
  estadoCivil: string
  observacoes: string
  familiaId: string
}

interface Pessoa extends PessoaForm {
  id?: number
  ativo?: boolean
}

interface Familia {
  id: string | number
  nome: string
}

export default function AdminPessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [familias, setFamilias] = useState<Familia[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<PessoaForm>({
    nome: '',
    dataNascimento: '',
    sexo: '',
    email: '',
    telefone: '',
    dataBatismo: '',
    membroDesde: '',
    estadoCivil: '',
    observacoes: '',
    familiaId: '',
  })

  const SEXO_OPTIONS = [
    { id: 1, nome: 'Masculino' },
    { id: 2, nome: 'Feminino' },
    { id: 3, nome: 'Outro' },
  ]

  const ESTADO_CIVIL_OPTIONS = [
    { id: 1, nome: 'Solteiro(a)' },
    { id: 2, nome: 'Casado(a)' },
    { id: 3, nome: 'Divorciado(a)' },
    { id: 4, nome: 'Viúvo(a)' },
    { id: 5, nome: 'União estável' },
  ]

  const FORM_FIELDS: FormField[] = [
    { name: 'nome', label: 'Nome', type: 'text', required: true },
    { name: 'email', label: 'E-mail', type: 'email', required: true },
    { name: 'telefone', label: 'Telefone', type: 'text' },
    { name: 'dataNascimento', label: 'Data de Nascimento', type: 'date' },
    { name: 'sexo', label: 'Sexo', type: 'select', options: SEXO_OPTIONS },
    { name: 'dataBatismo', label: 'Data de Batismo', type: 'date' },
    { name: 'membroDesde', label: 'Membro Desde', type: 'date', required: true },
    { name: 'estadoCivil', label: 'Estado Civil', type: 'select', options: ESTADO_CIVIL_OPTIONS },
    { name: 'observacoes', label: 'Observações', type: 'textarea' },
  ]

  function toDateInputValue(value?: string) {
    if (!value) return ''
    return value.slice(0, 10)
  }

  function toIsoDate(value: string) {
    return value ? new Date(`${value}T00:00:00.000Z`).toISOString() : ''
  }

  function toPayload(values: PessoaForm) {
    return {
      nome: values.nome,
      dataNascimento: toIsoDate(values.dataNascimento),
      sexo: Number(values.sexo || 0),
      email: values.email,
      telefone: values.telefone,
      dataBatismo: toIsoDate(values.dataBatismo),
      membroDesde: toIsoDate(values.membroDesde),
      estadoCivil: Number(values.estadoCivil || 0),
      observacoes: values.observacoes,
      familiaId: values.familiaId === '' ? null : Number(values.familiaId),
    }
  }

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
    setForm({
      nome: '',
      dataNascimento: '',
      sexo: '',
      email: '',
      telefone: '',
      dataBatismo: '',
      membroDesde: '',
      estadoCivil: '',
      observacoes: '',
      familiaId: '',
    })
    setEditingId(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form.nome || !form.email) {
      alert('Preencha os campos obrigatórios')
      return
    }

    try {
      const payload = toPayload(form)
      if (editingId) {
        await pessoasService.update(editingId, payload)
      } else {
        await pessoasService.create(payload)
      }
      await carregarDados()
      resetForm()
      setShowForm(false)
    } catch (err) {
      console.error('Erro:', err)
      alert('Erro ao salvar pessoa')
    }
  }

  async function handleDelete(id: number) {
    if (confirm('Tem certeza?')) {
      try {
        await pessoasService.remove(id)
        await carregarDados()
      } catch (err) {
        alert('Erro ao deletar')
      }
    }
  }

  function handleEdit(pessoa: Pessoa) {
    setForm({
      nome: pessoa.nome,
      dataNascimento: toDateInputValue(pessoa.dataNascimento),
      sexo: String(pessoa.sexo || ''),
      email: pessoa.email,
      telefone: pessoa.telefone,
      dataBatismo: toDateInputValue(pessoa.dataBatismo),
      membroDesde: toDateInputValue(pessoa.membroDesde),
      estadoCivil: String(pessoa.estadoCivil || ''),
      observacoes: pessoa.observacoes || '',
      familiaId: String(pessoa.familiaId || ''),
    })
    setEditingId(pessoa.id || null)
    setShowForm(true)
    window.scrollTo(0, 0)
  }

  const getFamiliaName = (id: string | number | undefined) => familias.find(f => f.id === id)?.nome || '—'

  async function buscarFamilias(query: string) {
    try {
      // Se vazio, retorna todas as famílias carregadas
      if (!query.trim()) {
        return familias.map(f => ({ id: f.id, label: f.nome }))
      }
      // Se tem query, busca via API
      const results = await familiasService.search(query)
      return results.map((f: any) => ({ id: f.id, label: f.nome || f.nome }))
    } catch (err) {
      console.error('Erro ao buscar famílias:', err)
      return []
    }
  }

  if (loading) return <div className="p-16">Carregando...</div>

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
        <div className={styles.formCard}>
          <h3>{editingId ? 'Editar Pessoa' : 'Nova Pessoa'}</h3>
          <form onSubmit={handleSubmit} className={styles.form}>
            {FORM_FIELDS.map((field) => {
              // Renderiza Família antes de Observações
              if (field.name === 'observacoes') {
                return (
                  <>
                    <div key="familia-group" className={styles.formGroup}>
                      <AsyncSearchSelect
                        label="Família"
                        placeholder="Buscar família..."
                        value={form.familiaId ? Number(form.familiaId) : null}
                        onChange={(value) => setForm({ ...form, familiaId: value ? String(value) : '' })}
                        onSearch={buscarFamilias}
                        minChars={0}
                        initialOptions={familias.map(f => ({ id: f.id, label: f.nome }))}
                      />
                    </div>
                    <div key={field.name} className={styles.formGroup}>
                      <label>
                        {field.label}
                        {field.required && ' *'}
                      </label>
                      <textarea
                        value={form[field.name as keyof PessoaForm] || ''}
                        onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                        required={field.required}
                      />
                    </div>
                  </>
                )
              }

              return (
                <div key={field.name} className={styles.formGroup}>
                  {field.type === 'select' ? (
                    <>
                      <label>
                        {field.label}
                        {field.required && ' *'}
                      </label>
                      <Select
                        value={form[field.name as keyof PessoaForm] || ''}
                        onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                        required={field.required}
                      >
                        <option value="">Selecione...</option>
                        {field.options?.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.nome}
                          </option>
                        ))}
                      </Select>
                    </>
                  ) : field.type === 'textarea' ? (
                    <>
                      <label>
                        {field.label}
                        {field.required && ' *'}
                      </label>
                      <textarea
                        value={form[field.name as keyof PessoaForm] || ''}
                        onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                        required={field.required}
                      />
                    </>
                  ) : (
                    <>
                      <label>
                        {field.label}
                        {field.required && ' *'}
                      </label>
                      <input
                        type={field.type}
                        value={form[field.name as keyof PessoaForm] || ''}
                        onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                        required={field.required}
                      />
                    </>
                  )}
                </div>
              )
            })}

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
              <th>E-mail</th>
              <th>Família</th>
              <th>Telefone</th>
              <th>Status</th>
              <th className={styles.actionsCell}>Ações</th>
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
                <td className={styles.actionsCell}>
                  <button className={styles.actionBtn} onClick={() => handleEdit(p)} title="Editar">
                    <Icons.EditIcon size={16} />
                  </button>
                  <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => handleDelete(p.id || 0)} title="Deletar">
                    <Icons.TrashIcon size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.info}>
        <p><b>Total:</b> {pessoas.length} pessoas cadastradas</p>
      </div>
    </div>
  )
}

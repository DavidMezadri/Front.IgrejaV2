import { useState, useEffect } from 'react'
import pessoasService from '../../services/pessoasService'
import familiasService from '../../services/familiasService'
import enderecoService, { Endereco } from '../../services/enderecoService'
import pessoaEnderecoService from '../../services/pessoaEnderecoService'
import { useFormErrors } from '../../hooks/useFormErrors'
import { isValidEmail } from '../../utils/validators'
import { FormField } from '../../components/molecules/GenericForm/GenericForm'
import { AsyncSearchSelect } from '../../components/molecules/AsyncSearchSelect'
import Select from '../../components/atoms/Select/Select'
import Badge from '../../components/atoms/Badge/Badge'
import * as Icons from '../../components/atoms/Icon/Icon'
import { formatCep } from '../../utils/cepFormatter'
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

interface Pessoa {
  id?: number
  nome: string
  dataNascimento?: string
  sexo?: string
  email: string
  telefone?: string
  dataBatismo?: string
  membroDesde: string
  estadoCivil?: string
  observacoes?: string
  familiaId?: string | number
  enderecoId?: string | number
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
  const [enderecos, setEnderecos] = useState<Endereco[]>([])
  const [pessoaEnderecos, setPessoaEnderecos] = useState<any[]>([])
  const [todosEnderecosPessoas, setTodosEnderecosPessoas] = useState<{ [key: number]: any[] }>({})
  const [showEnderecoSelect, setShowEnderecoSelect] = useState(false)
  const [selectedEnderecoId, setSelectedEnderecoId] = useState<number | null>(null)
  const [enderecoPrincipal, setEnderecoPrincipal] = useState(false)
  const { errors, clearError, clearAll, validate } = useFormErrors<Record<string, string>>()

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
      const [pessoasData, familiasData, enderecosData] = await Promise.all([
        pessoasService.list(),
        familiasService.list(),
        enderecoService.list()
      ])
      setPessoas(pessoasData)
      setFamilias(familiasData)
      setEnderecos(enderecosData)

      // Carregar endereços de todas as pessoas
      const enderecosMap: { [key: number]: any[] } = {}
      for (const pessoa of pessoasData) {
        if (pessoa.id) {
          try {
            const enderecos = await pessoaEnderecoService.list(pessoa.id)
            enderecosMap[pessoa.id] = enderecos
          } catch (err) {
            console.error(`Erro ao carregar endereços da pessoa ${pessoa.id}:`, err)
            enderecosMap[pessoa.id] = []
          }
        }
      }
      setTodosEnderecosPessoas(enderecosMap)
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
    setPessoaEnderecos([])
    setShowEnderecoSelect(false)
    setSelectedEnderecoId(null)
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


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const valido = validate([
      { field: 'nome', value: form.nome, required: true },
      { field: 'email', value: form.email, required: true, format: isValidEmail },
      { field: 'membroDesde', value: form.membroDesde, required: true },
    ])

    if (!valido) return

    try {
      const payload = toPayload(form)
      if (editingId) {
        await pessoasService.update(editingId, payload)
      } else {
        await pessoasService.create(payload)
      }
      await carregarDados()
      resetForm()
      clearAll()
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

  async function carregarEnderecosPessoa(pessoaId: number) {
    try {
      const enderecos = await pessoaEnderecoService.list(pessoaId)
      setPessoaEnderecos(enderecos)
    } catch (err) {
      console.error('Erro ao carregar endereços:', err)
      setPessoaEnderecos([])
    }
  }

  async function handleAdicionarEndereco() {
    if (!selectedEnderecoId || !editingId) return

    try {
      await pessoaEnderecoService.add(editingId, selectedEnderecoId, enderecoPrincipal)
      setSelectedEnderecoId(null)
      setEnderecoPrincipal(false)
      setShowEnderecoSelect(false)
      await carregarEnderecosPessoa(editingId)
    } catch (err) {
      console.error('Erro ao adicionar endereço:', err)
      alert('Erro ao adicionar endereço')
    }
  }

  async function handleRemoverEndereco(pessoaEnderecoId: number) {
    if (!confirm('Tem certeza que deseja remover este endereço?')) return

    try {
      await pessoaEnderecoService.remove(pessoaEnderecoId)
      if (editingId) {
        await carregarEnderecosPessoa(editingId)
      }
    } catch (err) {
      console.error('Erro ao remover endereço:', err)
      alert('Erro ao remover endereço')
    }
  }

  function handleEdit(pessoa: Pessoa) {
    setForm({
      nome: pessoa.nome,
      dataNascimento: toDateInputValue(pessoa.dataNascimento),
      sexo: String(pessoa.sexo || ''),
      email: pessoa.email,
      telefone: pessoa.telefone || '',
      dataBatismo: toDateInputValue(pessoa.dataBatismo),
      membroDesde: toDateInputValue(pessoa.membroDesde),
      estadoCivil: String(pessoa.estadoCivil || ''),
      observacoes: pessoa.observacoes || '',
      familiaId: String(pessoa.familiaId || ''),
    })
    setEditingId(pessoa.id || null)
    if (pessoa.id) {
      carregarEnderecosPessoa(pessoa.id)
    }
    setShowForm(true)
    window.scrollTo(0, 0)
  }

  const getFamiliaName = (id: string | number | undefined) => familias.find(f => f.id === id)?.nome || '—'

  const getEnderecoPrincipal = (pessoaId: string | number | undefined) => {
    if (!pessoaId) return '—'
    const enderecos = todosEnderecosPessoas[Number(pessoaId)] || []
    const principal = enderecos.find(pe => pe.principal)
    if (!principal?.endereco) return '—'
    return `${principal.endereco.rua}, ${principal.endereco.numero}`
  }

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
              // Renderiza Família e Endereço antes de Observações
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

              const hasError = errors[field.name]

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
                        onChange={(e) => { clearError(field.name); setForm({ ...form, [field.name]: e.target.value }) }}
                        className={hasError ? styles.inputError : ''}
                        required={field.required}
                      >
                        <option value="">Selecione...</option>
                        {field.options?.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.nome}
                          </option>
                        ))}
                      </Select>
                      {hasError && <span className={styles.fieldError}>{hasError}</span>}
                    </>
                  ) : field.type === 'textarea' ? (
                    <>
                      <label>
                        {field.label}
                        {field.required && ' *'}
                      </label>
                      <textarea
                        value={form[field.name as keyof PessoaForm] || ''}
                        onChange={(e) => { clearError(field.name); setForm({ ...form, [field.name]: e.target.value }) }}
                        className={hasError ? styles.inputError : ''}
                        required={field.required}
                      />
                      {hasError && <span className={styles.fieldError}>{hasError}</span>}
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
                        onChange={(e) => { clearError(field.name); setForm({ ...form, [field.name]: e.target.value }) }}
                        className={hasError ? styles.inputError : ''}
                        required={field.required}
                      />
                      {hasError && <span className={styles.fieldError}>{hasError}</span>}
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

          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e0e0e0' }}>
            <h4>Endereços da Pessoa</h4>

            {!editingId && (
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '1rem' }}>
                💡 Primeiro crie a pessoa para poder adicionar endereços.
              </p>
            )}

            {editingId && pessoaEnderecos.length > 0 ? (
              <div className={styles.tableContainer} style={{ marginBottom: '1.5rem' }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Endereço</th>
                      <th>Bairro</th>
                      <th>Cidade/Estado</th>
                      <th>CEP</th>
                      <th>Status</th>
                      <th className={styles.actionsCell}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pessoaEnderecos.map((pe) => (
                      <tr key={pe.id} className={!pe.principal ? styles.secondaryRow : ''}>
                        <td><b>{pe.endereco?.rua}, {pe.endereco?.numero}</b></td>
                        <td>{pe.endereco?.bairro || '—'}</td>
                        <td>{pe.endereco?.cidade}/{pe.endereco?.estado}</td>
                        <td>{pe.endereco?.cep ? formatCep(pe.endereco.cep) : '—'}</td>
                        <td><Badge variant={pe.principal ? 'ok' : 'default'}>{pe.principal ? 'Principal' : 'Secundário'}</Badge></td>
                        <td className={styles.actionsCell}>
                          <button
                            type="button"
                            className={`${styles.actionBtn} ${styles.danger}`}
                            onClick={() => handleRemoverEndereco(pe.id)}
                            title="Remover"
                          >
                            <Icons.TrashIcon size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : editingId ? (
              <p style={{ color: '#999', marginBottom: '1.5rem' }}>Nenhum endereço vinculado</p>
            ) : (
              <div className={styles.tableContainer} style={{ marginBottom: '1.5rem' }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Endereço</th>
                      <th>Bairro</th>
                      <th>Cidade/Estado</th>
                      <th>CEP</th>
                      <th>Status</th>
                      <th className={styles.actionsCell}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                        Nenhum endereço cadastrado
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {editingId && !showEnderecoSelect && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowEnderecoSelect(true)
                  setEnderecoPrincipal(false)
                  setSelectedEnderecoId(null)
                }}
              >
                + Adicionar Endereço
              </button>
            )}

            {editingId && showEnderecoSelect && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                <div className={styles.formGroup}>
                  <AsyncSearchSelect
                    label="Endereço"
                    placeholder="Buscar endereço..."
                    value={selectedEnderecoId}
                    onChange={(value) => setSelectedEnderecoId(value ? Number(value) : null)}
                    onSearch={buscarEnderecos}
                    minChars={0}
                    initialOptions={enderecos.filter(e => e.id).map(e => ({
                      id: e.id!,
                      label: `${e.rua}, ${e.numero} - ${e.bairro}, ${e.cidade}/${e.estado}`
                    }))}
                  />
                </div>
                <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id="enderecoPrincipal"
                    checked={enderecoPrincipal}
                    onChange={(e) => setEnderecoPrincipal(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <label htmlFor="enderecoPrincipal" style={{ cursor: 'pointer', marginBottom: '0' }}>
                    Marcar como endereço principal
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAdicionarEndereco}
                    disabled={!selectedEnderecoId}
                  >
                    Confirmar
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowEnderecoSelect(false)
                      setSelectedEnderecoId(null)
                      setEnderecoPrincipal(false)
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Família</th>
              <th>Endereço Principal</th>
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
                <td>{getEnderecoPrincipal(p.id)}</td>
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

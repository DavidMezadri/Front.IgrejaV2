import { useState, useEffect } from 'react'
import enderecoService, { Endereco } from '../../services/enderecoService'
import * as Icons from '../../components/atoms/Icon/Icon'
import { formatCep, unformatCep, isValidCep } from '../../utils/cepFormatter'
import styles from './Admin.module.css'

interface EnderecoForm {
  rua: string
  complemento: string
  numero: string
  bairro: string
  cidade: string
  estado: string
  cep: string
}

const defaultForm: EnderecoForm = {
  rua: '',
  complemento: '',
  numero: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
}

const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

export default function AdminEnderecos() {
  const [enderecos, setEnderecos] = useState<Endereco[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<EnderecoForm>(defaultForm)
  const [cepSearching, setCepSearching] = useState(false)

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    setLoading(true)
    try {
      const data = await enderecoService.list()
      setEnderecos(data)
    } catch (err) {
      console.error('Erro:', err)
    } finally {
      setLoading(false)
    }
  }

  async function buscarCEP(cep: string) {
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length !== 8) return

    setCepSearching(true)
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await response.json()

      if (data.erro) {
        alert('CEP não encontrado')
        return
      }

      setForm(prev => ({
        ...prev,
        rua: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || '',
      }))
    } catch (err) {
      console.error('Erro ao buscar CEP:', err)
      alert('Erro ao buscar CEP')
    } finally {
      setCepSearching(false)
    }
  }

  function handleCepChange(value: string) {
    const unformatted = unformatCep(value)
    const formatted = formatCep(unformatted)
    setForm({ ...form, cep: formatted })

    if (unformatted.length === 8) {
      buscarCEP(unformatted)
    }
  }

  function resetForm() {
    setForm(defaultForm)
    setEditingId(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form.rua || !form.numero || !form.bairro || !form.cidade || !form.estado) {
      alert('Preencha os campos obrigatórios')
      return
    }

    try {
      const payload: Endereco = {
        rua: form.rua,
        complemento: form.complemento,
        numero: form.numero,
        bairro: form.bairro,
        cidade: form.cidade,
        estado: form.estado,
        cep: form.cep,
      }

      if (editingId) {
        await enderecoService.update(editingId, payload)
      } else {
        await enderecoService.create(payload)
      }
      await carregarDados()
      resetForm()
      setShowForm(false)
    } catch (err) {
      console.error('Erro:', err)
      alert('Erro ao salvar endereço')
    }
  }

  async function handleDelete(id: number) {
    if (confirm('Tem certeza?')) {
      try {
        await enderecoService.remove(id)
        await carregarDados()
      } catch (err) {
        alert('Erro ao deletar')
      }
    }
  }

  function handleEdit(endereco: Endereco) {
    setForm({
      rua: endereco.rua || '',
      complemento: endereco.complemento || '',
      numero: endereco.numero || '',
      bairro: endereco.bairro || '',
      cidade: endereco.cidade || '',
      estado: endereco.estado || '',
      cep: formatCep(endereco.cep || ''),
    })
    setEditingId(endereco.id || null)
    setShowForm(true)
    window.scrollTo(0, 0)
  }

  if (loading) return <div className="p-16">Carregando...</div>

  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <div className="eyebrow">Gerenciamento</div>
          <h2>Endereços</h2>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
        >
          + Novo Endereço
        </button>
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <h3>{editingId ? 'Editar Endereço' : 'Novo Endereço'}</h3>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>CEP {cepSearching && '(buscando...)'}</label>
              <input
                type="text"
                placeholder="00000-000"
                value={form.cep}
                onChange={(e) => handleCepChange(e.target.value)}
                disabled={cepSearching}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Rua *</label>
              <input
                type="text"
                value={form.rua}
                onChange={(e) => setForm({ ...form, rua: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Número *</label>
              <input
                type="text"
                value={form.numero}
                onChange={(e) => setForm({ ...form, numero: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Complemento</label>
              <input
                type="text"
                placeholder="Apto, Sala, etc."
                value={form.complemento}
                onChange={(e) => setForm({ ...form, complemento: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Bairro *</label>
              <input
                type="text"
                value={form.bairro}
                onChange={(e) => setForm({ ...form, bairro: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Cidade *</label>
              <input
                type="text"
                value={form.cidade}
                onChange={(e) => setForm({ ...form, cidade: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Estado *</label>
              <select
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value })}
                required
              >
                <option value="">Selecione um estado</option>
                {ESTADOS.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
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
              <th>Endereço</th>
              <th>Bairro</th>
              <th>Cidade/Estado</th>
              <th>CEP</th>
              <th className={styles.actionsCell}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {enderecos.map(endereco => (
              <tr key={endereco.id}>
                <td><b>{endereco.rua}, {endereco.numero}</b></td>
                <td>{endereco.bairro || '—'}</td>
                <td>{endereco.cidade}/{endereco.estado}</td>
                <td>{endereco.cep ? formatCep(endereco.cep) : '—'}</td>
                <td className={styles.actionsCell}>
                  <button className={styles.actionBtn} onClick={() => handleEdit(endereco)} title="Editar">
                    <Icons.EditIcon size={16} />
                  </button>
                  <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => handleDelete(endereco.id || 0)} title="Deletar">
                    <Icons.TrashIcon size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.info}>
        <p><b>Total:</b> {enderecos.length} endereço(s) cadastrado(s)</p>
      </div>
    </div>
  )
}

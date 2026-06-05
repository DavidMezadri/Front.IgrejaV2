import { useState, useEffect } from 'react'
import familiasService from '../../services/familiasService'
import pessoasService from '../../services/pessoasService'
import { useFormErrors } from '../../hooks/useFormErrors'
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
  const [selectedFamiliaId, setSelectedFamiliaId] = useState<number | null>(null)
  const { errors, clearError, clearAll, validate } = useFormErrors<Record<string, string>>()

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

    const valido = validate([
      { field: 'nome', value: form.nome, required: true },
    ])

    if (!valido) return

    try {
      const payload = toPayload(form)
      if (editingId) {
        await familiasService.update(editingId, payload)
      } else {
        await familiasService.create(payload)
      }
      await carregarDados()
      resetForm()
      clearAll()
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

  const getResponsavelNome = (id?: number | null) => {
    if (!id) return '—'
    return pessoas.find(p => p.id === id)?.nome || '—'
  }

  const getPessoasDaFamilia = (familiaId?: number) => {
    if (!familiaId) return []
    return pessoas.filter(p => p.familiaId === familiaId)
  }

  const familiaDetalhes = selectedFamiliaId
    ? familias.find(f => f.id === selectedFamiliaId)
    : null

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
                onChange={(e) => { clearError('nome'); setForm({ ...form, nome: e.target.value }) }}
                className={errors.nome ? styles.inputError : ''}
              />
              {errors.nome && <span className={styles.fieldError}>{errors.nome}</span>}
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

      {familiaDetalhes ? (
        <div className={styles.formCard}>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>{familiaDetalhes.nome}</h3>
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedFamiliaId(null)}
            >
              ← Voltar
            </button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <p><b>Responsável:</b> {getResponsavelNome(familiaDetalhes.responsavelId)}</p>
            <p><b>Observações:</b> {familiaDetalhes.observacoes || '—'}</p>
          </div>

          <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <button
              className="btn btn-primary"
              onClick={() => handleEdit(familiaDetalhes)}
              title="Editar família"
            >
              <Icons.EditIcon size={16} /> Editar Família
            </button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4>Membros da Família ({getPessoasDaFamilia(familiaDetalhes.id).length})</h4>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Membro Desde</th>
                  <th>Status</th>
                  <th className={styles.actionsCell}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {getPessoasDaFamilia(familiaDetalhes.id).length > 0 ? (
                  getPessoasDaFamilia(familiaDetalhes.id).map(p => (
                    <tr key={p.id}>
                      <td><b>{p.nome}</b></td>
                      <td>{p.email || '—'}</td>
                      <td>{p.telefone || '—'}</td>
                      <td>{p.membroDesde ? new Date(p.membroDesde).toLocaleDateString('pt-BR') : '—'}</td>
                      <td>{p.ativo ? '✓ Ativo' : 'Inativo'}</td>
                      <td className={styles.actionsCell}>
                        <button className={styles.actionBtn} title="Visualizar pessoa">
                          <Icons.EditIcon size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                      Nenhuma pessoa cadastrada nesta família
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Membros</th>
                  <th>Responsável</th>
                  <th>Observações</th>
                  <th className={styles.actionsCell}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {familias.map(f => (
                  <tr key={f.id}>
                    <td><b>{f.nome}</b></td>
                    <td>{getPessoasDaFamilia(f.id).length} membros</td>
                    <td>{getResponsavelNome(f.responsavelId)}</td>
                    <td>{f.observacoes || '—'}</td>
                    <td className={styles.actionsCell}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => setSelectedFamiliaId(f.id || null)}
                        title="Ver detalhes"
                      >
                        <Icons.HomeIcon size={16} />
                      </button>
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
        </>
      )}
    </div>
  )
}

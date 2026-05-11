import { useState, useEffect } from 'react'
import versiculoService from '../../services/versiculoService'
import traducaoService from '../../services/traducaoService'
import GenericForm, { FormField } from '../../components/molecules/GenericForm/GenericForm'
import { livroOptions } from '../../types/LivroEnum'
import * as Icons from '../../components/atoms/Icon/Icon'
import styles from './Admin.module.css'

interface Versiculo {
  id?: number
  livro: number
  capitulo: number
  numero: number
  texto: string
  traducaoId: number
}

interface Traducao {
  id: number
  nome: string
}

export default function AdminVersiculos() {
  const [versiculos, setVersiculos] = useState<Versiculo[]>([])
  const [traducoes, setTraducoes] = useState<Traducao[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<Versiculo>({
    livro: 0,
    capitulo: 0,
    numero: 0,
    texto: '',
    traducaoId: 0
  })

  const FORM_FIELDS: FormField[] = [
    { name: 'livro', label: 'Livro', type: 'select', options: livroOptions, required: true },
    { name: 'capitulo', label: 'Capítulo', type: 'number', required: true },
    { name: 'numero', label: 'Versículo', type: 'number', required: true },
    { name: 'texto', label: 'Texto', type: 'textarea', required: true },
    { name: 'traducaoId', label: 'Tradução', type: 'select', options: traducoes, required: true },
  ]

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    setLoading(true)
    try {
      const [versiculosData, traducaoesData] = await Promise.all([
        versiculoService.list(),
        traducaoService.list()
      ])
      setVersiculos(versiculosData)
      setTraducoes(traducaoesData)
    } catch (err) {
      console.error('Erro ao carregar:', err)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setForm({ livro: 0, capitulo: 0, numero: 0, texto: '', traducaoId: 0 })
    setEditingId(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form.texto || !form.traducaoId) {
      alert('Preencha os campos obrigatórios')
      return
    }

    try {
      if (editingId) {
        await versiculoService.update(editingId, form)
      } else {
        await versiculoService.create(form)
      }
      await carregarDados()
      resetForm()
      setShowForm(false)
    } catch (err) {
      console.error('Erro:', err)
      alert('Erro ao salvar versículo')
    }
  }

  async function handleDelete(id: number) {
    if (confirm('Tem certeza?')) {
      try {
        await versiculoService.remove(id)
        await carregarDados()
      } catch (err) {
        alert('Erro ao deletar')
      }
    }
  }

  function handleEdit(versiculo: Versiculo) {
    setForm(versiculo)
    setEditingId(versiculo.id || null)
    setShowForm(true)
    window.scrollTo(0, 0)
  }

  const getTraducaoNome = (id: number | undefined) => traducoes.find(t => t.id === id)?.nome || '—'
  const getLivroNome = (id: number | undefined) => livroOptions.find(l => l.id === id)?.nome || '—'

  if (loading) return <div className="p-16">Carregando...</div>

  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <div className="eyebrow">Bíblia</div>
          <h2>Versículos</h2>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
        >
          + Novo Versículo
        </button>
      </div>

      {showForm && (
        <GenericForm
          title={editingId ? 'Editar Versículo' : 'Novo Versículo'}
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
              <th>Referência</th>
              <th>Texto</th>
              <th>Tradução</th>
              <th className={styles.actionsCell}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {versiculos.map(v => (
              <tr key={v.id}>
                <td><b>{getLivroNome(v.livro)} {v.capitulo}:{v.numero}</b></td>
                <td>{v.texto.substring(0, 50)}...</td>
                <td>{getTraducaoNome(v.traducaoId)}</td>
                <td className={styles.actionsCell}>
                  <button className={styles.actionBtn} onClick={() => handleEdit(v)} title="Editar">
                    <Icons.EditIcon size={16} />
                  </button>
                  <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => handleDelete(v.id || 0)} title="Deletar">
                    <Icons.TrashIcon size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.info}>
        <p><b>Total:</b> {versiculos.length} versículos cadastrados</p>
      </div>
    </div>
  )
}

import { useState, useEffect, useRef, useCallback } from 'react'
import versiculoService from '../../services/versiculoService'
import traducaoService from '../../services/traducaoService'
import GenericForm, { FormField } from '../../components/molecules/GenericForm/GenericForm'
import Select from '../../components/atoms/Select/Select'
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
  abreviacao?: string
}

export default function AdminVersiculos() {
  const [versiculos, setVersiculos] = useState<Versiculo[]>([])
  const [traducoes, setTraducoes] = useState<Traducao[]>([])
  const [filtroLivro, setFiltroLivro] = useState<number | ''>('')
  const [filtroTraducao, setFiltroTraducao] = useState<number | ''>('')
  const [pagina, setPagina] = useState(1)
  const [temProxima, setTemProxima] = useState(false)
  const [carregandoMais, setCarregandoMais] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const tableEndRef = useRef<HTMLDivElement>(null)
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
    carregarTraducoes()
  }, [])

  useEffect(() => {
    setPagina(1)
    setVersiculos([])
    carregarVersiculos(1)
  }, [filtroLivro, filtroTraducao])

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && temProxima && !carregandoMais) {
        carregarVersiculos(pagina + 1)
      }
    })
    if (tableEndRef.current) observer.observe(tableEndRef.current)
    return () => observer.disconnect()
  }, [pagina, temProxima, carregandoMais])

  async function carregarTraducoes() {
    try {
      const data = await traducaoService.list()
      setTraducoes(data)
    } catch (err) {
      console.error('Erro ao carregar traduções:', err)
    }
  }

  async function carregarVersiculos(pag: number) {
    if (pag === 1) {
      setLoading(true)
    } else {
      setCarregandoMais(true)
    }

    try {
      const filtros: Record<string, unknown> = {}
      if (filtroLivro) filtros.livro = filtroLivro
      if (filtroTraducao) filtros.traducaoId = filtroTraducao

      const response = await versiculoService.listPaginado(pag, 100, filtros)
      const novosVersiculos = response.dados || []

      if (pag === 1) {
        setVersiculos(novosVersiculos)
      } else {
        setVersiculos(prev => [...prev, ...novosVersiculos])
      }

      setPagina(pag)
      setTemProxima(response.temProxima || false)
    } catch (err) {
      console.error('Erro ao carregar versículos:', err)
    } finally {
      setLoading(false)
      setCarregandoMais(false)
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
      setPagina(1)
      setVersiculos([])
      await carregarVersiculos(1)
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
        setPagina(1)
        setVersiculos([])
        await carregarVersiculos(1)
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

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <Select
          value={filtroLivro}
          onChange={(e) => setFiltroLivro(e.target.value ? parseInt(e.target.value) : '')}
        >
          <option value="">Todos os livros</option>
          {livroOptions.map(livro => (
            <option key={livro.id} value={livro.id}>{livro.nome}</option>
          ))}
        </Select>

        <Select
          value={filtroTraducao}
          onChange={(e) => setFiltroTraducao(e.target.value ? parseInt(e.target.value) : '')}
        >
          <option value="">Todas as traduções</option>
          {traducoes.map(trad => (
            <option key={trad.id} value={trad.id}>{trad.nome}</option>
          ))}
        </Select>
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
        <div ref={tableEndRef} />
      </div>

      {carregandoMais && <div style={{ textAlign: 'center', padding: '1rem' }}>Carregando mais...</div>}

      <div className={styles.info}>
        <p><b>Total exibido:</b> {versiculos.length} versículos</p>
      </div>
    </div>
  )
}

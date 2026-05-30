import { useState, useEffect } from 'react'
import eventosService from '../../services/eventosService'
import presencasService from '../../services/presencasService'
import pessoasService from '../../services/pessoasService'
import familiasService from '../../services/familiasService'
import { AsyncSearchSelect, AsyncSelectOption } from '../../components/molecules/AsyncSearchSelect'
import Select from '../../components/atoms/Select/Select'
import Badge from '../../components/atoms/Badge/Badge'
import styles from './Admin.module.css'

interface Evento {
  id: number
  nome: string
  dataInicio: string
  ativo?: boolean
}

interface Membro {
  id: number
  nome: string
  email?: string
  telefone?: string
}

interface Presenca {
  id: number
  pessoaId: number
  presente?: boolean
  Presente?: boolean
}

export default function AdminPresencas() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [eventoSelecionado, setEventoSelecionado] = useState<string>('')
  const [familiaCarregada, setFamiliaCarregada] = useState<Membro[]>([])
  const [presencasJaRegistradas, setPresencasJaRegistradas] = useState<Map<number, Presenca>>(new Map())
  const [marcados, setMarcados] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(false)
  const [salvando, setSalvando] = useState(false)

  const formatData = (data: string) => new Date(data).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' })
  const getEventoNome = (id: string) => eventos.find(e => e.id === Number(id))?.nome || ''

  useEffect(() => {
    carregarEventos()
  }, [])

  async function carregarEventos() {
    setLoading(true)
    try {
      const data = await eventosService.list()
      setEventos(data)
    } catch (err) {
      console.error('Erro ao carregar eventos:', err)
    } finally {
      setLoading(false)
    }
  }

  async function buscarPessoas(query: string) {
    try {
      if (!query.trim()) return []
      const results = await pessoasService.search(query)
      return results.map((p: any) => ({ id: p.id, label: p.nome }))
    } catch (err) {
      console.error('Erro ao buscar pessoas:', err)
      return []
    }
  }

  async function handlePessoaSelecionada(pessoaId: string | number | null) {
    if (!pessoaId || !eventoSelecionado) {
      setFamiliaCarregada([])
      setPresencasJaRegistradas(new Map())
      setMarcados(new Set())
      return
    }

    try {
      // Buscar dados da pessoa
      const pessoa = await pessoasService.getById(pessoaId)

      // Carregare família se existir
      let membros: Membro[] = []
      if (pessoa.familiaId) {
        const familia = await familiasService.getById(pessoa.familiaId)
        membros = familia.membros || []
      } else {
        // Se não tem família, registra só a pessoa
        membros = [{ id: pessoa.id, nome: pessoa.nome, email: pessoa.email, telefone: pessoa.telefone }]
      }

      setFamiliaCarregada(membros)

      // Carregar presenças já registradas para este evento
      const presencasEvent = await presencasService.listByEvento(Number(eventoSelecionado))
      const presencasMap = new Map<number, Presenca>()

      presencasEvent.forEach((p: any) => {
        presencasMap.set(p.pessoaId, p)
      })

      setPresencasJaRegistradas(presencasMap)
      // Marcar todos por padrão
      setMarcados(new Set(membros.map(m => m.id)))
    } catch (err) {
      console.error('Erro ao carregar família:', err)
      alert('Erro ao carregar dados da família')
    }
  }

  function handleToggleMembro(pessoaId: number) {
    const novosMarcados = new Set(marcados)
    if (novosMarcados.has(pessoaId)) {
      novosMarcados.delete(pessoaId)
    } else {
      novosMarcados.add(pessoaId)
    }
    setMarcados(novosMarcados)
  }

  function handleToggleTodos() {
    if (marcados.size === familiaCarregada.length && familiaCarregada.length > 0) {
      setMarcados(new Set())
    } else {
      const todos = new Set(familiaCarregada.map(m => m.id))
      setMarcados(todos)
    }
  }

  async function handleRegistrarPresencas() {
    if (!eventoSelecionado) {
      alert('Selecione um evento')
      return
    }

    if (familiaCarregada.length === 0) {
      alert('Nenhuma família carregada')
      return
    }

    if (marcados.size === 0) {
      alert('Selecione pelo menos um membro')
      return
    }

    setSalvando(true)
    try {
      const eventoId = Number(eventoSelecionado)
      let sucesso = 0
      let erros = 0

      // Para cada membro marcado
      for (const pessoaId of marcados) {
        try {
          const presencaExistente = presencasJaRegistradas.get(pessoaId)

          if (presencaExistente) {
            // Atualizar se já existe
            if (!presencaExistente.presente) {
              await presencasService.update(presencaExistente.id, { Presente: true })
            }
          } else {
            // Criar nova presença
            await presencasService.create({
              EventoId: eventoId,
              PessoaId: pessoaId,
              Presente: true,
            })
          }
          sucesso++
        } catch (err: any) {
          // 409 Conflict = presença já registrada por outro processo
          if (err.response?.status === 409) {
            sucesso++
          } else {
            console.error('Erro ao registrar presença:', err)
            erros++
          }
        }
      }

      // Para cada membro NÃO marcado que tinha presença marcada
      for (const [pessoaId, presenca] of presencasJaRegistradas) {
        const estavaPresente = presenca.presente || presenca.Presente
        if (estavaPresente && !marcados.has(pessoaId)) {
          try {
            await presencasService.update(presenca.id, { Presente: false })
            sucesso++
          } catch (err) {
            console.error('Erro ao atualizar presença:', err)
            erros++
          }
        }
      }

      if (erros === 0) {
        alert(`✓ ${sucesso} presença(s) registrada(s)`)
        setFamiliaCarregada([])
        setMarcados(new Set())
        setPresencasJaRegistradas(new Map())
      } else {
        alert(`✓ ${sucesso} registradas, ✗ ${erros} com erro`)
      }
    } catch (err) {
      console.error('Erro ao registrar presenças:', err)
      alert('Erro ao registrar presenças')
    } finally {
      setSalvando(false)
    }
  }

  if (loading) return <div className="p-16">Carregando...</div>

  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <div className="eyebrow">Controle</div>
          <h2>Registro de Presenças</h2>
        </div>
      </div>

      <div className={styles.formCard}>
        <h3>Registrar Presença</h3>
        <form onSubmit={(e) => { e.preventDefault() }} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Evento *</label>
            <Select
              value={eventoSelecionado}
              onChange={(e) => {
                setEventoSelecionado(e.target.value)
                setFamiliaCarregada([])
                setMarcados(new Set())
                setPresencasJaRegistradas(new Map())
              }}
              required
            >
              <option value="">Selecione um evento...</option>
              {eventos.map((evento) => (
                <option key={evento.id} value={evento.id}>
                  {evento.nome} - {formatData(evento.dataInicio)}
                </option>
              ))}
            </Select>
          </div>

          {eventoSelecionado && (
            <div className={styles.formGroup}>
              <AsyncSearchSelect
                label="Buscar Pessoa"
                placeholder="Digite o nome..."
                value={null}
                onChange={handlePessoaSelecionada}
                onSearch={buscarPessoas}
                minChars={2}
                debounceMs={300}
              />
            </div>
          )}
        </form>
      </div>

      {familiaCarregada.length > 0 && (
        <div className={styles.formCard}>
          <h3>
            {familiaCarregada.length === 1 ? 'Membro' : `Família (${familiaCarregada.length} membros)`}
          </h3>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={marcados.size === familiaCarregada.length && familiaCarregada.length > 0}
                      onChange={handleToggleTodos}
                      title="Marcar/desmarcar todos"
                    />
                  </th>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Telefone</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {familiaCarregada.map((membro) => {
                  const jaRegistrado = presencasJaRegistradas.has(membro.id)
                  const estaMarcado = marcados.has(membro.id)

                  return (
                    <tr key={membro.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={estaMarcado}
                          onChange={() => handleToggleMembro(membro.id)}
                        />
                      </td>
                      <td><b>{membro.nome}</b></td>
                      <td>{membro.email || '—'}</td>
                      <td>{membro.telefone || '—'}</td>
                      <td>
                        {jaRegistrado ? (
                          <Badge variant="ok">Registrado</Badge>
                        ) : (
                          <Badge variant="danger">Não registrado</Badge>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className={styles.info}>
            <p>
              <b>Selecionados:</b> {marcados.size} de {familiaCarregada.length}
            </p>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleRegistrarPresencas}
              disabled={marcados.size === 0 || salvando}
            >
              {salvando ? 'Registrando...' : '✓ Registrar Presenças'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setFamiliaCarregada([])
                setMarcados(new Set())
                setPresencasJaRegistradas(new Map())
              }}
            >
              Limpar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

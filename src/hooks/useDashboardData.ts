import { useQuery } from '@tanstack/react-query'
import presencasService from '../services/presencasService'
import pessoasService from '../services/pessoasService'
import eventosService from '../services/eventosService'

export function useDashboardData() {
  const { data: presencas = [] } = useQuery({
    queryKey: ['presencas'],
    queryFn: () => presencasService.list(),
  })

  const { data: pessoas = [] } = useQuery({
    queryKey: ['pessoas'],
    queryFn: () => pessoasService.list(),
  })

  const { data: eventos = [] } = useQuery({
    queryKey: ['eventos'],
    queryFn: () => eventosService.list(),
  })

  const ultimoCulto = eventos.length > 0
    ? eventos.sort((a: any, b: any) => new Date(b.dataEvento || 0).getTime() - new Date(a.dataEvento || 0).getTime())[0]
    : null

  const presencasUltimoCulto = ultimoCulto
    ? presencas.filter((p: any) => p.idEvento === ultimoCulto.id || p.eventoId === ultimoCulto.id)
    : []

  const ultimoCultoChart = [
    {
      name: 'Presentes',
      value: presencasUltimoCulto.length,
      fill: '#059669'
    },
    {
      name: 'Ausentes',
      value: Math.max(0, pessoas.length - presencasUltimoCulto.length),
      fill: '#dc2626'
    }
  ]

  const mediaPresencaPorEvento = eventos.map((evento: any) => {
    const presencasEvento = presencas.filter((p: any) => p.idEvento === evento.id || p.eventoId === evento.id)
    const percentual = pessoas.length > 0 ? Math.round((presencasEvento.length / pessoas.length) * 100) : 0
    return {
      name: evento.descricao?.substring(0, 10) || `Evento ${evento.id}`,
      presencas: presencasEvento.length,
      percentual,
      data: evento.dataEvento
    }
  }).sort((a: any, b: any) => new Date(b.data || 0).getTime() - new Date(a.data || 0).getTime()).slice(0, 12)

  const historicosCadastros = Array.from({ length: 30 }, (_, i) => {
    const data = new Date()
    data.setDate(data.getDate() - (29 - i))
    const dataStr = data.toISOString().split('T')[0]

    const pessoasNaData = pessoas.filter((p: any) => {
      const dataCadastro = p.dataCadastro?.split('T')[0] || p.createdAt?.split('T')[0]
      return dataCadastro && dataCadastro <= dataStr
    }).length

    return {
      data: data.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
      pessoas: pessoasNaData,
      dataISO: dataStr
    }
  })

  const pessoasPorFaltas: Record<number, number> = {}

  pessoas.forEach((pessoa: any) => {
    const faltas = presencas.filter((p: any) => !(p.pessoaId === pessoa.id || p.idPessoa === pessoa.id)).length
    const rangeF = Math.min(Math.floor(faltas / 5) * 5, 20)
    pessoasPorFaltas[rangeF] = (pessoasPorFaltas[rangeF] || 0) + 1
  })

  const pessoasPorFaltasChart = [
    { range: '0-4', pessoas: pessoasPorFaltas[0] || 0 },
    { range: '5-9', pessoas: pessoasPorFaltas[5] || 0 },
    { range: '10-14', pessoas: pessoasPorFaltas[10] || 0 },
    { range: '15-19', pessoas: pessoasPorFaltas[15] || 0 },
    { range: '20+', pessoas: pessoasPorFaltas[20] || 0 },
  ].filter(d => d.pessoas > 0)

  return {
    ultimoCulto,
    ultimoCultoChart,
    mediaPresencaPorEvento,
    historicosCadastros,
    pessoasPorFaltasChart,
    totalPessoas: pessoas.length,
    totalPresencas: presencas.length,
  }
}

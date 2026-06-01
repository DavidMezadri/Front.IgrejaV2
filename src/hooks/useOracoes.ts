import { useQuery } from '@tanstack/react-query'
import oracoesService from '../services/oracoesService'
import { DATA } from '../data/mockData'

export function useOracoes() {
  return useQuery({
    queryKey: ['oracoes'],
    queryFn: () => oracoesService.list(),
    placeholderData: DATA.oracoes,
    staleTime: 1000 * 60 * 5,
  })
}

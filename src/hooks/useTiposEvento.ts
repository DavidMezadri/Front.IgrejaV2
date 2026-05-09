import { useQuery } from '@tanstack/react-query'
import tiposEventoService from '../services/tiposEventoService'
import { DATA } from '../data/mockData'

export function useTiposEvento() {
  return useQuery({
    queryKey: ['tiposEvento'],
    queryFn: tiposEventoService.list,
    placeholderData: DATA.tiposEvento,
    staleTime: 1000 * 60 * 10,
  })
}

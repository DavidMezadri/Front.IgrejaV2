import { useQuery } from '@tanstack/react-query'
import familiasService from '../services/familiasService'
import { DATA } from '../data/mockData'

export function useFamilias(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['familias', params],
    queryFn: () => familiasService.list(params),
    placeholderData: DATA.familias,
    staleTime: 1000 * 60 * 5,
  })
}

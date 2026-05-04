import { useQuery } from '@tanstack/react-query'
import familiasService from '../services/familiasService'
import { DATA } from '../data/mockData'

export function useFamilias(params) {
  return useQuery({
    queryKey: ['familias', params],
    queryFn: () => familiasService.list(params),
    placeholderData: DATA.familias,
    staleTime: 1000 * 60 * 5,
  })
}

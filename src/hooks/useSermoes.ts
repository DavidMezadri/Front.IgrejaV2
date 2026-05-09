import { useQuery } from '@tanstack/react-query'
import sermoesService from '../services/sermoesService'
import { DATA } from '../data/mockData'

export function useSermoes() {
  return useQuery({
    queryKey: ['sermoes'],
    queryFn: sermoesService.list,
    placeholderData: DATA.sermoes,
    staleTime: 1000 * 60 * 10,
  })
}

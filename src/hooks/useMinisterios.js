import { useQuery } from '@tanstack/react-query'
import ministeriosService from '../services/ministeriosService'
import { DATA } from '../data/mockData'

export function useMinisterios() {
  return useQuery({
    queryKey: ['ministerios'],
    queryFn: ministeriosService.list,
    placeholderData: DATA.ministerios,
    staleTime: 1000 * 60 * 10,
  })
}

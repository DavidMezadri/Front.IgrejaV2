import { useQuery } from '@tanstack/react-query'
import pessoasService from '../services/pessoasService'
import { DATA } from '../data/mockData'

export function usePessoas(params) {
  return useQuery({
    queryKey: ['pessoas', params],
    queryFn: () => pessoasService.list(params),
    placeholderData: DATA.pessoas,
    staleTime: 1000 * 60 * 5,
  })
}

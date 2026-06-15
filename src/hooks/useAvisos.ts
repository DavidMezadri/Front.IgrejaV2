import { useQuery } from '@tanstack/react-query'
import avisosService from '../services/avisosService'

export function useAvisos() {
  return useQuery({
    queryKey: ['avisos'],
    queryFn: () => avisosService.list(),
    staleTime: 1000 * 60 * 5,
  })
}

import { useQuery } from '@tanstack/react-query'
import avisosService from '../services/avisosService'
import { DATA } from '../data/mockData'

export function useAvisos() {
  return useQuery({
    queryKey: ['avisos'],
    queryFn: avisosService.list,
    placeholderData: DATA.avisos,
    staleTime: 1000 * 60 * 5,
  })
}

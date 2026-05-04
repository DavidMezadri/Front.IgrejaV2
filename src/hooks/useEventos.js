import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import eventosService from '../services/eventosService'
import { DATA } from '../data/mockData'

export function useEventos(params) {
  return useQuery({
    queryKey: ['eventos', params],
    queryFn: () => eventosService.list(params),
    placeholderData: DATA.eventos,
    staleTime: 1000 * 60 * 2,
  })
}

export function useEvento(id) {
  return useQuery({
    queryKey: ['eventos', id],
    queryFn: () => eventosService.getById(id),
    enabled: !!id,
  })
}

export function useCreateEvento() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: eventosService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['eventos'] }),
  })
}

export function useUpdateEvento() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => eventosService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['eventos'] }),
  })
}

export function useRemoveEvento() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: eventosService.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['eventos'] }),
  })
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import configService from '../services/configService'

export interface PageConfig {
  [key: string]: string
}

export function usePageConfig() {
  return useQuery({
    queryKey: ['pageConfig'],
    queryFn: async () => {
      const data = await configService.list()
      return data as PageConfig
    },
    staleTime: 5 * 60 * 1000, // cache 5 min
  })
}

export function useUpdatePageConfig() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (configs: Array<{ chave: string; valor: string }>) => {
      return configService.update(configs)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pageConfig'] })
    },
  })
}

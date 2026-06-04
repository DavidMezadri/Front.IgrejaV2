import api from '../api/client'
import { EP } from '../api/endpoints'

export interface Igreja {
  id?: number
  nome: string
  email: string
  telefone?: string
  enderecoId?: number
  lema?: string
  ativo?: boolean
}

const igrejaService = {
  list:   () => api.get(EP.IGREJAS.LIST).then(r => r.data),
  one:    (id: number) => api.get(EP.IGREJAS.ONE(id)).then(r => r.data),
  create: (data: Igreja) => api.post(EP.IGREJAS.CREATE, data).then(r => r.data),
  update: (id: number, data: Igreja) => api.put(EP.IGREJAS.UPDATE(id), data).then(r => r.data),
  remove: (id: number) => api.delete(EP.IGREJAS.REMOVE(id)).then(r => r.data),
}

export default igrejaService

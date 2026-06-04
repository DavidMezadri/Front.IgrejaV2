import api from '../api/client'
import { EP } from '../api/endpoints'

export interface Endereco {
  id?: number
  rua: string
  complemento?: string
  numero: string
  bairro: string
  cidade: string
  estado: string
  cep?: string
}

const enderecoService = {
  list:   () => api.get(EP.ENDERECOS.LIST).then(r => r.data),
  one:    (id: number) => api.get(EP.ENDERECOS.ONE(id)).then(r => r.data),
  create: (data: Endereco) => api.post(EP.ENDERECOS.CREATE, data).then(r => r.data),
  update: (id: number, data: Endereco) => api.put(EP.ENDERECOS.UPDATE(id), data).then(r => r.data),
  remove: (id: number) => api.delete(EP.ENDERECOS.REMOVE(id)).then(r => r.data),
}

export default enderecoService

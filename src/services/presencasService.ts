import api from '../api/client'
import { EP } from '../api/endpoints'

const presencasService = {
  list:        (params?: Record<string, unknown>) => api.get(EP.PRESENCAS.LIST, { params }).then(r => r.data),
  getById:     (id: string | number) => api.get(EP.PRESENCAS.ONE(id)).then(r => r.data),
  create:      (data: Record<string, unknown>) => api.post(EP.PRESENCAS.CREATE, data).then(r => r.data),
  update:      (id: string | number, data: Record<string, unknown>) => api.put(EP.PRESENCAS.UPDATE(id), data).then(r => r.data),
  remove:      (id: string | number) => api.delete(EP.PRESENCAS.REMOVE(id)).then(r => r.data),
  listByEvento:(eventoId: string | number) => api.get(EP.PRESENCAS.BY_EVENTO(eventoId)).then(r => r.data),
  listByPessoa:(pessoaId: string | number) => api.get(EP.PRESENCAS.BY_PESSOA(pessoaId)).then(r => r.data),
}

export default presencasService

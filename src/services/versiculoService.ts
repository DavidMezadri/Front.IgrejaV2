import api from '../api/client'
import { EP } from '../api/endpoints'

const versiculoService = {
  list: (params?: Record<string, unknown>) => api.get(EP.VERSICULOS.LIST, { params }).then(r => r.data),
  getById: (id: string | number) => api.get(EP.VERSICULOS.ONE(id)).then(r => r.data),
  create: (data: Record<string, unknown>) => api.post(EP.VERSICULOS.CREATE, data).then(r => r.data),
  update: (id: string | number, data: Record<string, unknown>) => api.put(EP.VERSICULOS.UPDATE(id), data).then(r => r.data),
  remove: (id: string | number) => api.delete(EP.VERSICULOS.REMOVE(id)).then(r => r.data),
}

export default versiculoService

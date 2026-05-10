import api from '../api/client'
import { EP } from '../api/endpoints'

const traducaoService = {
  list: (params?: Record<string, unknown>) => api.get(EP.TRADUCOES.LIST, { params }).then(r => r.data),
  getById: (id: string | number) => api.get(EP.TRADUCOES.ONE(id)).then(r => r.data),
  create: (data: Record<string, unknown>) => api.post(EP.TRADUCOES.CREATE, data).then(r => r.data),
  update: (id: string | number, data: Record<string, unknown>) => api.put(EP.TRADUCOES.UPDATE(id), data).then(r => r.data),
  remove: (id: string | number) => api.delete(EP.TRADUCOES.REMOVE(id)).then(r => r.data),
}

export default traducaoService

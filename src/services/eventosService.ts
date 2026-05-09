import api from '../api/client'
import { EP } from '../api/endpoints'

const eventosService = {
  list:    (params?: Record<string, unknown>) => api.get(EP.EVENTOS.LIST, { params }).then(r => r.data),
  getById: (id: string | number) => api.get(EP.EVENTOS.ONE(id)).then(r => r.data),
  create:  (data: Record<string, unknown>) => api.post(EP.EVENTOS.CREATE, data).then(r => r.data),
  update:  (id: string | number, data: Record<string, unknown>) => api.put(EP.EVENTOS.UPDATE(id), data).then(r => r.data),
  remove:  (id: string | number) => api.delete(EP.EVENTOS.REMOVE(id)).then(r => r.data),
}

export default eventosService

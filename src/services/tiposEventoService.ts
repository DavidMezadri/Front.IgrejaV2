import api from '../api/client'
import { EP } from '../api/endpoints'

const tiposEventoService = {
  list:    (params?: Record<string, unknown>) => api.get(EP.TIPOS_EVENTO.LIST, { params }).then(r => r.data),
  getById: (id: string | number) => api.get(EP.TIPOS_EVENTO.ONE(id)).then(r => r.data),
  create:  (data: Record<string, unknown>) => api.post(EP.TIPOS_EVENTO.CREATE, data).then(r => r.data),
  update:  (id: string | number, data: Record<string, unknown>) => api.put(EP.TIPOS_EVENTO.UPDATE(id), data).then(r => r.data),
  remove:  (id: string | number) => api.delete(EP.TIPOS_EVENTO.REMOVE(id)).then(r => r.data),
}

export default tiposEventoService

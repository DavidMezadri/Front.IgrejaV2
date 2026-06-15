import api from '../api/client'
import { EP } from '../api/endpoints'

const avisosService = {
  list: () => api.get(EP.AVISOS.LIST).then(r => r.data),
  getById: (id: string | number) => api.get(EP.AVISOS.ONE(id)).then(r => r.data),
  listAtivos: () => api.get(EP.AVISOS.ATIVOS).then(r => r.data),
  create: (data: Record<string, unknown>) => api.post(EP.AVISOS.CREATE, data).then(r => r.data),
  update: (id: string | number, data: Record<string, unknown>) => api.put(EP.AVISOS.UPDATE(id), data).then(r => r.data),
  remove: (id: string | number) => api.delete(EP.AVISOS.REMOVE(id)).then(r => r.data),
}

export default avisosService

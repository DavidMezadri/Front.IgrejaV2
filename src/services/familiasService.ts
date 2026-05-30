import api from '../api/client'
import { EP } from '../api/endpoints'

const familiasService = {
  list:    (params?: Record<string, unknown>) => api.get(EP.FAMILIAS.LIST, { params }).then(r => r.data),
  getById: (id: string | number) => api.get(EP.FAMILIAS.ONE(id)).then(r => r.data),
  create:  (data: Record<string, unknown>) => api.post(EP.FAMILIAS.CREATE, data).then(r => r.data),
  update:  (id: string | number, data: Record<string, unknown>) => api.put(EP.FAMILIAS.UPDATE(id), data).then(r => r.data),
  remove:  (id: string | number) => api.delete(EP.FAMILIAS.REMOVE(id)).then(r => r.data),
  search:  (nome: string) => api.get(EP.FAMILIAS.SEARCH, { params: { nome } }).then(r => r.data),
}

export default familiasService

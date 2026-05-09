import api from '../api/client'
import { EP } from '../api/endpoints'

const pessoasService = {
  list:    (params?: Record<string, unknown>) => api.get(EP.PESSOAS.LIST, { params }).then(r => r.data),
  getById: (id: string | number) => api.get(EP.PESSOAS.ONE(id)).then(r => r.data),
  create:  (data: Record<string, unknown>) => api.post(EP.PESSOAS.CREATE, data).then(r => r.data),
  update:  (id: string | number, data: Record<string, unknown>) => api.put(EP.PESSOAS.UPDATE(id), data).then(r => r.data),
  remove:  (id: string | number) => api.delete(EP.PESSOAS.REMOVE(id)).then(r => r.data),
}

export default pessoasService

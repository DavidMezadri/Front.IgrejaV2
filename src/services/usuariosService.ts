import api from '../api/client'
import { EP } from '../api/endpoints'

const usuariosService = {
  list:    (params?: Record<string, unknown>) => api.get(EP.USUARIOS.LIST, { params }).then(r => r.data),
  getById: (id: string | number) => api.get(EP.USUARIOS.ONE(id)).then(r => r.data),
  update:  (id: string | number, data: Record<string, unknown>) => api.put(EP.USUARIOS.UPDATE(id), data).then(r => r.data),
  remove:  (id: string | number) => api.delete(EP.USUARIOS.REMOVE(id)).then(r => r.data),
}

export default usuariosService

import api from '../api/client'
import { EP } from '../api/endpoints'

const familiasService = {
  list:    (params?: Record<string, unknown>) => api.get(EP.FAMILIAS.LIST, { params }).then(r => r.data),
  getById: (id: string | number) => api.get(EP.FAMILIAS.ONE(id)).then(r => r.data),
}

export default familiasService

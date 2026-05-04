import api from '../api/client'
import { EP } from '../api/endpoints'

const familiasService = {
  list:    params => api.get(EP.FAMILIAS.LIST, { params }).then(r => r.data),
  getById: id     => api.get(EP.FAMILIAS.ONE(id)).then(r => r.data),
}

export default familiasService

import api from '../api/client'
import { EP } from '../api/endpoints'

const presencasService = {
  list:   params => api.get(EP.PRESENCAS.LIST, { params }).then(r => r.data),
  create: data   => api.post(EP.PRESENCAS.CREATE, data).then(r => r.data),
}

export default presencasService

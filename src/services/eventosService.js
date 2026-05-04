import api from '../api/client'
import { EP } from '../api/endpoints'

const eventosService = {
  list:    params      => api.get(EP.EVENTOS.LIST, { params }).then(r => r.data),
  getById: id          => api.get(EP.EVENTOS.ONE(id)).then(r => r.data),
  create:  data        => api.post(EP.EVENTOS.CREATE, data).then(r => r.data),
  update:  (id, data)  => api.put(EP.EVENTOS.UPDATE(id), data).then(r => r.data),
  remove:  id          => api.delete(EP.EVENTOS.REMOVE(id)).then(r => r.data),
}

export default eventosService

import api from '../api/client'
import { EP } from '../api/endpoints'

const pessoasService = {
  list:    params     => api.get(EP.PESSOAS.LIST, { params }).then(r => r.data),
  getById: id         => api.get(EP.PESSOAS.ONE(id)).then(r => r.data),
  create:  data       => api.post(EP.PESSOAS.CREATE, data).then(r => r.data),
  update:  (id, data) => api.put(EP.PESSOAS.UPDATE(id), data).then(r => r.data),
  remove:  id         => api.delete(EP.PESSOAS.REMOVE(id)).then(r => r.data),
}

export default pessoasService

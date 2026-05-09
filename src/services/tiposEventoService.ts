import api from '../api/client'
import { EP } from '../api/endpoints'

const tiposEventoService = {
  list: () => api.get(EP.TIPOS_EVENTO.LIST).then(r => r.data),
}

export default tiposEventoService

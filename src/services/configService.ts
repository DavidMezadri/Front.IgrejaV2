import api from '../api/client'
import { EP } from '../api/endpoints'

interface ConfigData {
  [key: string]: unknown
}

const configService = {
  list:   () => api.get(EP.CONFIG.LIST).then(r => r.data),
  update: (data: ConfigData) => api.put(EP.CONFIG.UPDATE, data).then(r => r.data),
}

export default configService

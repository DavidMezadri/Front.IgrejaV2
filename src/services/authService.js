import api from '../api/client'
import { EP } from '../api/endpoints'

const authService = {
  login:  (username, password) =>
    api.post(EP.AUTH.LOGIN, { nomeUsuario: username, senha: password }).then(r => r.data),
  me:     () => api.get(EP.AUTH.ME).then(r => r.data),
  logout: () => api.post(EP.AUTH.LOGOUT).then(r => r.data),
}

export default authService

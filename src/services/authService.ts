import api from '../api/client'
import { EP } from '../api/endpoints'

interface RegisterData {
  nomeUsuario: string
  senha: string
  nome: string
  email: string
}

const authService = {
  login:    (username: string, password: string) =>
    api.post(EP.AUTH.LOGIN, { nomeUsuario: username, senha: password }).then(r => r.data),
  register: (data: RegisterData) =>
    api.post(EP.AUTH.REGISTER, data).then(r => r.data),
  me:       () => api.get(EP.AUTH.ME).then(r => r.data),
  logout:   () => api.post(EP.AUTH.LOGOUT).then(r => r.data),
}

export default authService

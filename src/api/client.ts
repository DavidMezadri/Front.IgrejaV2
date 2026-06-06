import axios, { AxiosInstance } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    const status = err.response?.status
    const url = err.config?.url || 'desconhecido'

    if (status === 401) {
      console.error(`[401] Não autorizado: ${url}`)
      localStorage.removeItem('auth_token')
    } else if (status === 403) {
      console.error(`[403] Proibido: ${url}`)
    } else if (err.message === 'Network Error') {
      console.error(`[Network] Erro de conexão com API: ${url}`)
    }

    return Promise.reject(err)
  }
)

export default api

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import authService from '../services/authService'

interface User {
  [key: string]: unknown
}

interface AuthContextType {
  user: User | null
  role: 'admin' | 'membro' | null
  loading: boolean
  login: (username: string, password: string) => Promise<User>
  logout: () => Promise<void>
  isAuthenticated: boolean
  isAdmin: boolean
  isMember: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<'admin' | 'membro' | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    const savedRole = localStorage.getItem('auth_role')
    if (!token) {
      setLoading(false)
      return
    }
    authService.me()
      .then(userData => {
        setUser(userData)
        setRole(savedRole || 'membro')
      })
      .catch(error => {
        console.error('Erro ao validar token:', error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_role')
      })
      .finally(() => setLoading(false))
  }, [])

  async function login(username: string, password: string): Promise<User> {
    const data = await authService.login(username, password)
    localStorage.setItem('auth_token', data.token)

    // Define role baseado no tipoUsuario do backend
    // TipoUsuarioEnum: Administrador=0, Pastor=1, Presidente=2, Comissao=3, Membro=4, Visitante=5
    const tipoUsuario = data.usuario?.tipoUsuario
    const userRole = (tipoUsuario === 0 || tipoUsuario === 'Administrador') ? 'admin' : 'membro'
    localStorage.setItem('auth_role', userRole)

    setUser(data.usuario)
    setRole(userRole)
    return data.usuario
  }

  async function logout(): Promise<void> {
    await authService.logout().catch(() => {})
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_role')
    setUser(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      role,
      loading,
      login,
      logout,
      isAuthenticated: !!user,
      isAdmin: role === 'admin',
      isMember: role === 'membro'
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

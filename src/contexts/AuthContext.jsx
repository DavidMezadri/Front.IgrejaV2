import { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) { setLoading(false); return }
    authService.me()
      .then(setUser)
      .catch(() => localStorage.removeItem('auth_token'))
      .finally(() => setLoading(false))
  }, [])

  async function login(username, password) {
    const data = await authService.login(username, password)
    localStorage.setItem('auth_token', data.token)
    setUser(data.user)
    return data.user
  }

  async function logout() {
    await authService.logout().catch(() => {})
    localStorage.removeItem('auth_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

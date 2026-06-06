import { ReactNode } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function AppLoader({ children }: { children: ReactNode }) {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg)',
        color: 'var(--text)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>⛪</div>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

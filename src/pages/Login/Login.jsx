import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import styles from './Login.module.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [fields, setFields] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(fields.username, fields.password)
      navigate('/admin')
    } catch {
      setError('Usuário ou senha incorretos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="block" id="login">
      <div className={styles.wrap}>
        <form className={styles.card} onSubmit={submit}>
          <div className="eyebrow">Acesso de membros</div>
          <h2>Entrar</h2>
          <p>Use suas credenciais cadastradas pela secretaria.</p>
          <label>Nome de usuário</label>
          <input
            value={fields.username}
            onChange={e => setFields({ ...fields, username: e.target.value })}
            placeholder="ex: joao.silva"
            autoComplete="username"
            required
          />
          <label>Senha</label>
          <input
            type="password"
            value={fields.password}
            onChange={e => setFields({ ...fields, password: e.target.value })}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
          {error && <p style={{ color: 'var(--accent)', margin: '4px 0 0', fontSize: 14 }}>{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 22 }}>
            {loading ? 'Entrando…' : <>Entrar <span className="arrow" /></>}
          </button>
          <div className={styles.alt}>
            <a href="#">Esqueci minha senha</a> · <a href="#/admin">Acesso admin</a>
          </div>
        </form>
      </div>
    </section>
  )
}

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import authService from '../../services/authService'
import styles from './Signup.module.css'

export default function Signup() {
  const navigate = useNavigate()
  const [fields, setFields] = useState({
    nomeUsuario: '',
    nome: '',
    email: '',
    senha: '',
    confirmSenha: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  function validate(): boolean {
    const newErrors: Record<string, string> = {}

    if (!fields.nomeUsuario.trim()) newErrors.nomeUsuario = 'Nome de usuário é obrigatório'
    if (fields.nomeUsuario.length < 3) newErrors.nomeUsuario = 'Mínimo 3 caracteres'

    if (!fields.nome.trim()) newErrors.nome = 'Nome completo é obrigatório'

    if (!fields.email.trim()) newErrors.email = 'Email é obrigatório'
    if (!fields.email.includes('@')) newErrors.email = 'Email inválido'

    if (!fields.senha) newErrors.senha = 'Senha é obrigatória'
    if (fields.senha.length < 6) newErrors.senha = 'Mínimo 6 caracteres'

    if (!fields.confirmSenha) newErrors.confirmSenha = 'Confirme a senha'
    if (fields.senha !== fields.confirmSenha) newErrors.confirmSenha = 'As senhas não coincidem'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await authService.register({
        nomeUsuario: fields.nomeUsuario,
        senha: fields.senha,
        nome: fields.nome,
        email: fields.email,
      })
      navigate('/login?registered=true')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao cadastrar. Tente novamente.'
      setErrors({ submit: message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="block" id="signup">
      <div className={styles.wrap}>
        <form className={styles.card} onSubmit={submit}>
          <div className="eyebrow">Novo membro</div>
          <h2>Cadastro</h2>
          <p>Crie sua conta para acessar a plataforma da comunidade.</p>

          <label>Nome completo</label>
          <input
            value={fields.nome}
            onChange={e => setFields({ ...fields, nome: e.target.value })}
            placeholder="Ex: João Silva"
            required
          />
          {errors.nome && <p className={styles.error}>{errors.nome}</p>}

          <label>Email</label>
          <input
            type="email"
            value={fields.email}
            onChange={e => setFields({ ...fields, email: e.target.value })}
            placeholder="seu@email.com"
            required
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}

          <label>Nome de usuário</label>
          <input
            value={fields.nomeUsuario}
            onChange={e => setFields({ ...fields, nomeUsuario: e.target.value })}
            placeholder="Ex: joao.silva"
            autoComplete="username"
            required
          />
          {errors.nomeUsuario && <p className={styles.error}>{errors.nomeUsuario}</p>}

          <label>Senha</label>
          <input
            type="password"
            value={fields.senha}
            onChange={e => setFields({ ...fields, senha: e.target.value })}
            placeholder="••••••••"
            autoComplete="new-password"
            required
          />
          {errors.senha && <p className={styles.error}>{errors.senha}</p>}

          <label>Confirmar senha</label>
          <input
            type="password"
            value={fields.confirmSenha}
            onChange={e => setFields({ ...fields, confirmSenha: e.target.value })}
            placeholder="••••••••"
            autoComplete="new-password"
            required
          />
          {errors.confirmSenha && <p className={styles.error}>{errors.confirmSenha}</p>}

          {errors.submit && <p className={styles.error}>{errors.submit}</p>}

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 22 }}
          >
            {loading ? 'Cadastrando…' : <>Cadastrar <span className="arrow" /></>}
          </button>

          <div className={styles.alt}>
            Já tem conta? <Link to="/login">Entrar aqui</Link>
          </div>
        </form>
      </div>
    </section>
  )
}

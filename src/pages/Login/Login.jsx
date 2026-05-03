import styles from './Login.module.css'

export default function Login() {
  return (
    <section className="block" id="login">
      <div className={styles.wrap}>
        <form className={styles.card} onSubmit={e => e.preventDefault()}>
          <div className="eyebrow">Acesso de membros</div>
          <h2>Entrar</h2>
          <p>Use suas credenciais cadastradas pela secretaria.</p>
          <label>Nome de usuário</label>
          <input placeholder="ex: joao.silva" />
          <label>Senha</label>
          <input type="password" placeholder="••••••••" />
          <button className="btn btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center', marginTop: 22 }}>
            Entrar <span className="arrow" />
          </button>
          <div className={styles.alt}>
            <a href="#">Esqueci minha senha</a> · <a href="#/admin">Acesso admin</a>
          </div>
        </form>
      </div>
    </section>
  )
}

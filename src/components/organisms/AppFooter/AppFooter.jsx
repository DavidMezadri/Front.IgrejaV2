import styles from './AppFooter.module.css'

const DEFAULT_IGREJA = { nome: '', lema: '', endereco: '', telefone: '', email: '' }

export default function AppFooter({ igreja = DEFAULT_IGREJA }) {
  return (
    <footer className={styles.foot}>
      <div className="container">
        <div className={styles.grid}>
          <div>
            <div className={styles.brand}>
              <span className={styles.brandMark}>CG</span>
              <div>
                <div className={styles.brandName}>{igreja.nome}</div>
                <div className={styles.brandSub}>Desde 1996 · São Paulo</div>
              </div>
            </div>
            <p>{igreja.lema} Cultos abertos a todos, sem distinção.</p>
          </div>
          <div>
            <h4>Endereço</h4>
            <ul>
              <li>{igreja.endereco}</li>
              <li>{igreja.telefone}</li>
              <li>{igreja.email}</li>
            </ul>
          </div>
          <div>
            <h4>Acesso</h4>
            <ul>
              <li><a href="#/calendario">Calendário</a></li>
              <li><a href="#/semanal">Cultos</a></li>
              <li><a href="#/ministerios">Ministérios</a></li>
              <li><a href="#/login">Área de membros</a></li>
            </ul>
          </div>
          <div>
            <h4>API</h4>
            <ul>
              <li>IgrejaV2 · v1</li>
              <li><span className="kbd">/api/eventos</span></li>
              <li><span className="kbd">/api/pessoas</span></li>
              <li><span className="kbd">/api/auth/login</span></li>
            </ul>
          </div>
        </div>
        <div className={styles.copy}>
          <div>© 2026 {igreja.nome}. Todos os direitos reservados.</div>
          <div>Feito com cuidado para a comunidade.</div>
        </div>
      </div>
    </footer>
  )
}

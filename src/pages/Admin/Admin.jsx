import { DATA } from '../../data/mockData'
import { fmtDataLonga } from '../../utils/dateUtils'
import Badge from '../../components/atoms/Badge/Badge'
import styles from './Admin.module.css'

export default function Admin() {
  return (
    <section className="block" id="admin">
      <div className="container">
        <div className="block-head">
          <div>
            <div className="eyebrow">Painel · Administração</div>
            <h2>Pessoas e famílias</h2>
          </div>
          <a href="#" className="btn btn-primary">+ Nova pessoa</a>
        </div>
        <div className={styles.grid}>
          <aside className={styles.side}>
            <h4>Cadastros</h4>
            <a className={styles.active} href="#">Pessoas <small>{DATA.pessoas.length}</small></a>
            <a href="#">Famílias <small>{DATA.familias.length}</small></a>
            <a href="#">Eventos <small>{DATA.eventos.length}</small></a>
            <a href="#">Tipos de evento <small>{DATA.tiposEvento.length}</small></a>
            <h4>Operação</h4>
            <a href="#">Presenças</a>
            <a href="#">Usuários do sistema</a>
            <a href="#">Configurações</a>
          </aside>
          <div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th><th>Família</th><th>Membro desde</th><th>Contato</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {DATA.pessoas.map(p => {
                  const fam = DATA.familias.find(f => f.id === p.familiaId)
                  return (
                    <tr key={p.id}>
                      <td><b>{p.nome}</b></td>
                      <td>{fam?.nome || '—'}</td>
                      <td>{p.membroDesde ? fmtDataLonga(p.membroDesde) : '—'}</td>
                      <td>{p.email}</td>
                      <td>{p.ativo ? <Badge variant="ok">Ativo</Badge> : <Badge>Inativo</Badge>}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

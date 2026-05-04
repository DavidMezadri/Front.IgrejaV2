import { usePessoas } from '../../hooks/usePessoas'
import { useFamilias } from '../../hooks/useFamilias'
import { useEventos } from '../../hooks/useEventos'
import { useTiposEvento } from '../../hooks/useTiposEvento'
import { fmtDataLonga } from '../../utils/dateUtils'
import Badge from '../../components/atoms/Badge/Badge'
import styles from './Admin.module.css'

export default function Admin() {
  const { data: pessoas = [] } = usePessoas()
  const { data: familias = [] } = useFamilias()
  const { data: eventos = [] } = useEventos()
  const { data: tiposEvento = [] } = useTiposEvento()

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
            <a className={styles.active} href="#">Pessoas <small>{pessoas.length}</small></a>
            <a href="#">Famílias <small>{familias.length}</small></a>
            <a href="#">Eventos <small>{eventos.length}</small></a>
            <a href="#">Tipos de evento <small>{tiposEvento.length}</small></a>
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
                {pessoas.map(p => {
                  const fam = familias.find(f => f.id === p.familiaId)
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

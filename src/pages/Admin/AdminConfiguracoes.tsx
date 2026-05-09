import { useState, useEffect } from 'react'
import configService from '../../services/configService'
import endpointStyles from './AdminEndpoints.module.css'
import styles from './Admin.module.css'

interface Config {
  nomeIgreja: string
  email: string
  telefone: string
  endereco: string
  lema: string
  mensagemBoasVindas: string
  [key: string]: string | boolean | number
}

export default function AdminConfiguracoes() {
  const [config, setConfig] = useState<Config>({
    nomeIgreja: 'Comunidade da Graça',
    email: 'contato@comunidadedagraca.org',
    telefone: '(11) 3000-0000',
    endereco: 'Rua das Acácias, 248 — Centro, São Paulo/SP',
    lema: 'Uma igreja para a cidade.',
    mensagemBoasVindas: 'Bem-vindo à nossa comunidade!',
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    setLoading(true)
    try {
      const data = await configService.list()
      if (data) setConfig(data)
    } catch (err) {
      console.error('Erro ao carregar configurações:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    try {
      await configService.update(config)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Erro:', err)
      alert('Erro ao salvar configurações')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !config.nomeIgreja) return <div style={{ padding: '28px' }}>Carregando...</div>

  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <div className="eyebrow">Administração</div>
          <h2>Configurações</h2>
        </div>
        <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
          Ajustes gerais do sistema
        </div>
      </div>

      <div className={endpointStyles.formCard}>
        <form onSubmit={handleSubmit} className={endpointStyles.form}>
          <h3>Informações da Igreja</h3>

          <div className={endpointStyles.formGroup}>
            <label>Nome da Igreja *</label>
            <input
              type="text"
              value={config.nomeIgreja}
              onChange={e => setConfig({ ...config, nomeIgreja: e.target.value })}
              required
            />
          </div>

          <div className={endpointStyles.row}>
            <div className={endpointStyles.formGroup}>
              <label>Email *</label>
              <input
                type="email"
                value={config.email}
                onChange={e => setConfig({ ...config, email: e.target.value })}
                required
              />
            </div>

            <div className={endpointStyles.formGroup}>
              <label>Telefone</label>
              <input
                type="tel"
                value={config.telefone}
                onChange={e => setConfig({ ...config, telefone: e.target.value })}
                placeholder="(11) 0000-0000"
              />
            </div>
          </div>

          <div className={endpointStyles.formGroup}>
            <label>Endereço</label>
            <input
              type="text"
              value={config.endereco}
              onChange={e => setConfig({ ...config, endereco: e.target.value })}
              placeholder="Rua, número — Cidade/UF"
            />
          </div>

          <div className={endpointStyles.formGroup}>
            <label>Lema da Igreja</label>
            <input
              type="text"
              value={config.lema}
              onChange={e => setConfig({ ...config, lema: e.target.value })}
              placeholder="Ex: Uma igreja para a cidade"
            />
          </div>

          <hr style={{ margin: '28px 0', borderColor: 'var(--line)' }} />

          <h3>Personalização</h3>

          <div className={endpointStyles.formGroup}>
            <label>Mensagem de Boas-vindas</label>
            <textarea
              value={config.mensagemBoasVindas}
              onChange={e => setConfig({ ...config, mensagemBoasVindas: e.target.value })}
              placeholder="Mensagem exibida aos novos usuários"
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px 14px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--line-strong)',
                backgroundColor: 'var(--surface)',
                color: 'var(--fg)',
                fontFamily: 'inherit',
                fontSize: 'inherit',
              }}
            />
          </div>

          <div className={endpointStyles.formActions}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Salvando…' : 'Salvar Configurações'}
            </button>
          </div>

          {saved && (
            <div style={{
              padding: '12px 14px',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              borderLeft: '4px solid rgb(34, 197, 94)',
              borderRadius: 'var(--radius)',
              color: 'var(--fg)',
              fontSize: 14,
              marginTop: 16,
            }}>
              ✓ Configurações salvas com sucesso!
            </div>
          )}
        </form>
      </div>

      <div className={endpointStyles.info} style={{ marginTop: 28 }}>
        <h3>Informações do Sistema</h3>
        <p><b>Nome:</b> {config.nomeIgreja}</p>
        <p><b>Email:</b> {config.email}</p>
        <p><b>Telefone:</b> {config.telefone}</p>
        <p><b>Endereço:</b> {config.endereco}</p>
      </div>
    </div>
  )
}

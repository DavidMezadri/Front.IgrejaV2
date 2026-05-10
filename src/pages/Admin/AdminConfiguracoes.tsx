import { useState, useEffect } from 'react'
import configService from '../../services/configService'
import GenericForm, { FormField } from '../../components/molecules/GenericForm/GenericForm'
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

const FORM_FIELDS: FormField[] = [
  { name: 'nomeIgreja', label: 'Nome da Igreja', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'telefone', label: 'Telefone', type: 'tel' },
  { name: 'endereco', label: 'Endereço', type: 'text' },
  { name: 'lema', label: 'Lema da Igreja', type: 'text' },
  { name: 'mensagemBoasVindas', label: 'Mensagem de Boas-vindas', type: 'textarea' },
]

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

  if (loading && !config.nomeIgreja) return <div className="p-16">Carregando...</div>

  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <div className="eyebrow">Administração</div>
          <h2>Configurações</h2>
        </div>
        <div className="text-muted">
          Ajustes gerais do sistema
        </div>
      </div>

      <GenericForm
        title="Informações da Igreja"
        fields={FORM_FIELDS}
        values={config}
        onValueChange={(updates) => setConfig({ ...config, ...updates })}
        onSubmit={handleSubmit}
        onCancel={() => {}}
        submitLabel={loading ? 'Salvando…' : 'Salvar Configurações'}
        showCancel={false}
      />

      {saved && (
        <div className={styles['alert-success']}>
          ✓ Configurações salvas com sucesso!
        </div>
      )}

      <div className={`${styles.info} ${styles.infoSection}`}>
        <h3>Informações do Sistema</h3>
        <p><b>Nome:</b> {config.nomeIgreja}</p>
        <p><b>Email:</b> {config.email}</p>
        <p><b>Telefone:</b> {config.telefone}</p>
        <p><b>Endereço:</b> {config.endereco}</p>
      </div>
    </div>
  )
}

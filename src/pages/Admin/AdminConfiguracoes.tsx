import { useState, useEffect } from 'react'
import configService from '../../services/configService'
import { isValidEmail, isValidTelefone } from '../../utils/validators'
import GenericForm, { FormField } from '../../components/molecules/GenericForm/GenericForm'
import styles from './Admin.module.css'

interface Config {
  [key: string]: string | boolean | number
}

const FORM_FIELDS: FormField[] = [
  { name: 'igreja.nome', label: 'Nome da Igreja', type: 'text', required: true },
  { name: 'igreja.email', label: 'Email', type: 'email', required: true },
  { name: 'igreja.telefone', label: 'Telefone', type: 'text' },
  { name: 'igreja.endereco', label: 'Endereço', type: 'text' },
  { name: 'igreja.lema', label: 'Lema da Igreja', type: 'text' },
  { name: 'home.mensagemBoasVindas', label: 'Mensagem de Boas-vindas', type: 'textarea' },
]

export default function AdminConfiguracoes() {
  const [config, setConfig] = useState<Config>({
    'igreja.nome': 'Comunidade da Graça',
    'igreja.email': 'contato@comunidadedagraca.org',
    'igreja.telefone': '(11) 3000-0000',
    'igreja.endereco': 'Rua das Acácias, 248 — Centro, São Paulo/SP',
    'igreja.lema': 'Uma igreja para a cidade.',
    'home.mensagemBoasVindas': 'Bem-vindo à nossa comunidade!',
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

    const erros: string[] = []
    if (!config['igreja.nome'] || !config['igreja.nome'].toString().trim()) {
      erros.push('Nome da Igreja é obrigatório')
    }
    if (!config['igreja.email'] || !isValidEmail(config['igreja.email'].toString())) {
      erros.push('Email válido é obrigatório')
    }
    if (config['igreja.telefone'] && !isValidTelefone(config['igreja.telefone'].toString())) {
      erros.push('Telefone inválido (use formato com dígitos, espaços, hífens ou parênteses)')
    }

    if (erros.length > 0) {
      alert(`Verifique os seguintes campos:\n• ${erros.join('\n• ')}`)
      return
    }

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
        <p><b>Nome:</b> {config['igreja.nome']}</p>
        <p><b>Email:</b> {config['igreja.email']}</p>
        <p><b>Telefone:</b> {config['igreja.telefone']}</p>
        <p><b>Endereço:</b> {config['igreja.endereco']}</p>
      </div>
    </div>
  )
}

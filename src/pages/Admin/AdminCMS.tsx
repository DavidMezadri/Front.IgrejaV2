import { useState } from 'react'
import { usePageConfig, useUpdatePageConfig } from '../../hooks/usePageConfig'
import styles from './Admin.module.css'

type TabId = 'home' | 'igreja' | 'sobre'

interface Tab {
  id: TabId
  label: string
}

const TABS: Tab[] = [
  { id: 'home', label: 'Home' },
  { id: 'igreja', label: 'Igreja' },
  { id: 'sobre', label: 'Sobre' },
]

interface FormData {
  [key: string]: string
}

export default function AdminCMS() {
  const { data: config = {}, isLoading } = usePageConfig()
  const { mutate: atualizar, isPending: isSaving } = useUpdatePageConfig()
  const [tabAtiva, setTabAtiva] = useState<TabId>('home')
  const [formData, setFormData] = useState<FormData>({})

  const handleInputChange = (chave: string, valor: string) => {
    setFormData(prev => ({
      ...prev,
      [chave]: valor,
    }))
  }

  const handleSalvar = () => {
    const configsParaAtualizar = Object.entries(formData).map(([chave, valor]) => ({
      chave,
      valor,
    }))

    atualizar(configsParaAtualizar, {
      onSuccess: () => {
        alert('✓ Configurações salvas com sucesso!')
        setFormData({})
      },
      onError: (err: any) => {
        console.error('Erro ao salvar:', err)
        alert('✗ Erro ao salvar configurações')
      },
    })
  }

  const getValor = (chave: string): string => {
    return formData[chave] !== undefined ? formData[chave] : (config[chave] || '')
  }

  const temAlteracoes = Object.keys(formData).length > 0

  if (isLoading) return <div className="p-16">Carregando...</div>

  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <div className="eyebrow">Gerenciamento</div>
          <h2>CMS - Editar Páginas</h2>
        </div>
      </div>

      <div className={styles.formCard}>
        <div className={styles.tabsContainer}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tabButton} ${tabAtiva === tab.id ? styles.tabActive : ''}`}
              onClick={() => setTabAtiva(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ABA HOME */}
        {tabAtiva === 'home' && (
          <form onSubmit={(e) => { e.preventDefault() }} className={styles.form}>
            <h3>Configuração da Home</h3>

            <div className={styles.formGroup}>
              <label>Título Principal *</label>
              <input
                type="text"
                value={getValor('home.titulo')}
                onChange={(e) => handleInputChange('home.titulo', e.target.value)}
                placeholder="Ex: Um lugar para encontrar a Cristo..."
              />
            </div>

            <div className={styles.formGroup}>
              <label>Subtítulo *</label>
              <input
                type="text"
                value={getValor('home.subtitulo')}
                onChange={(e) => handleInputChange('home.subtitulo', e.target.value)}
                placeholder="Ex: Domingos às 9h e 19h..."
              />
            </div>

            <div className={styles.formGroup}>
              <label>Texto de Apoio</label>
              <textarea
                value={getValor('home.textoApoio')}
                onChange={(e) => handleInputChange('home.textoApoio', e.target.value)}
                placeholder="Texto adicional para a home"
                rows={4}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Horários</label>
              <input
                type="text"
                value={getValor('home.horarios')}
                onChange={(e) => handleInputChange('home.horarios', e.target.value)}
                placeholder="Ex: Domingos: 9h e 19h"
              />
            </div>
          </form>
        )}

        {/* ABA IGREJA */}
        {tabAtiva === 'igreja' && (
          <form onSubmit={(e) => { e.preventDefault() }} className={styles.form}>
            <h3>Dados da Igreja</h3>

            <div className={styles.formGroup}>
              <label>Nome da Igreja *</label>
              <input
                type="text"
                value={getValor('igreja.nome')}
                onChange={(e) => handleInputChange('igreja.nome', e.target.value)}
                placeholder="Ex: Comunidade da Graça"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Lema / Frase</label>
              <input
                type="text"
                value={getValor('igreja.lema')}
                onChange={(e) => handleInputChange('igreja.lema', e.target.value)}
                placeholder="Ex: Uma igreja para a cidade"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Endereço *</label>
              <input
                type="text"
                value={getValor('igreja.endereco')}
                onChange={(e) => handleInputChange('igreja.endereco', e.target.value)}
                placeholder="Ex: Rua das Acácias, 248 — Centro"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Telefone</label>
              <input
                type="tel"
                value={getValor('igreja.telefone')}
                onChange={(e) => handleInputChange('igreja.telefone', e.target.value)}
                placeholder="Ex: (11) 3000-0000"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                value={getValor('igreja.email')}
                onChange={(e) => handleInputChange('igreja.email', e.target.value)}
                placeholder="Ex: contato@igreja.com"
              />
            </div>
          </form>
        )}

        {/* ABA SOBRE */}
        {tabAtiva === 'sobre' && (
          <form onSubmit={(e) => { e.preventDefault() }} className={styles.form}>
            <h3>Página Sobre</h3>

            <div className={styles.formGroup}>
              <label>Texto Descritivo</label>
              <textarea
                value={getValor('sobre.texto')}
                onChange={(e) => handleInputChange('sobre.texto', e.target.value)}
                placeholder="Texto descritivo sobre a comunidade..."
                rows={8}
              />
            </div>
          </form>
        )}

        {/* BOTÕES DE AÇÃO */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSalvar}
            disabled={!temAlteracoes || isSaving}
          >
            {isSaving ? 'Salvando...' : '✓ Salvar Alterações'}
          </button>
          {temAlteracoes && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setFormData({})}
              disabled={isSaving}
            >
              Descartar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

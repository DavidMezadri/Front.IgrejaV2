import { useState } from 'react'
import { usePageConfig, useUpdatePageConfig, useImagensUpload } from '../../hooks/usePageConfig'
import uploadService from '../../services/uploadService'
import { useQueryClient } from '@tanstack/react-query'
import styles from './Admin.module.css'

const getImageUrl = (url: string) => {
  const apiUrl = import.meta.env.VITE_API_URL
  if (!apiUrl?.startsWith('http')) return url
  // Remove /api do final se existir, pois imagens estão em /uploads, não /api/uploads
  const domainUrl = apiUrl.replace(/\/api$/, '')
  return `${domainUrl}${url}`
}

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
  const { data: config = {}, isLoading, refetch } = usePageConfig()
  const { mutate: atualizar, isPending: isSaving } = useUpdatePageConfig()
  const queryClient = useQueryClient()
  const { data: imagens = [], isLoading: loadingImagens } = useImagensUpload()
  const [tabAtiva, setTabAtiva] = useState<TabId>('home')
  const [formData, setFormData] = useState<FormData>({})
  const [uploadingFoto, setUploadingFoto] = useState(false)
  const [deletandoFoto, setDeletandoFoto] = useState<string | null>(null)

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

  const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0]
    if (!arquivo) return

    setUploadingFoto(true)
    try {
      const resultado = await uploadService.uploadImagem(arquivo)
      console.log('Upload sucesso, URL:', resultado.url)

      const configsParaAtualizar = [
        { chave: 'home.fotoBanner', valor: resultado.url }
      ]

      atualizar(configsParaAtualizar, {
        onSuccess: () => {
          console.log('Config salva, refazendo fetch...')
          refetch()
          queryClient.invalidateQueries({ queryKey: ['imagensUpload'] })
          alert('✓ Foto enviada e salva com sucesso!')
        },
        onError: (err: any) => {
          console.error('Erro ao salvar config:', err)
          alert('✗ Erro ao salvar foto')
        }
      })
    } catch (err: any) {
      console.error('Erro ao fazer upload:', err)
      alert('✗ Erro ao fazer upload da foto')
    } finally {
      setUploadingFoto(false)
    }
  }

  const handleDeleteFoto = async (nomeArquivo: string) => {
    if (!confirm(`Remover a imagem "${nomeArquivo}"?`)) return
    setDeletandoFoto(nomeArquivo)
    try {
      await uploadService.deleteImagem(nomeArquivo)
      queryClient.invalidateQueries({ queryKey: ['imagensUpload'] })
    } catch (err: any) {
      console.error('Erro ao deletar imagem:', err)
      alert('✗ Erro ao remover imagem')
    } finally {
      setDeletandoFoto(null)
    }
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

            <div className={styles.formGroup}>
              <label>Galeria de Imagens do Banner</label>

              {loadingImagens ? (
                <p className={styles.imageEmpty}>Carregando...</p>
              ) : imagens.length === 0 ? (
                <p className={styles.imageEmpty}>Nenhuma imagem enviada ainda.</p>
              ) : (
                <div className={styles.imageGallery}>
                  {imagens.map((img) => (
                    <div key={img.nomeArquivo} className={styles.imageCard}>
                      <img
                        src={getImageUrl(img.url)}
                        alt={img.nomeArquivo}
                      />
                      <button
                        type="button"
                        className={styles.imageCardBtn}
                        onClick={() => handleDeleteFoto(img.nomeArquivo)}
                        disabled={deletandoFoto === img.nomeArquivo}
                        title="Remover imagem"
                      >
                        {deletandoFoto === img.nomeArquivo ? '...' : '✕ Excluir'}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleUploadFoto}
                disabled={uploadingFoto}
                className={styles.uploadInput}
              />
              <small className={styles.uploadHint}>
                Formatos: JPG, PNG, GIF, WebP · Máximo 5MB
              </small>
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
        <div className={styles.formActions}>
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

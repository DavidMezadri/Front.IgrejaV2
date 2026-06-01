import api from '../api/client'
import { EP } from '../api/endpoints'

interface UploadResponse {
  url: string
  nomeArquivo: string
  mensagem: string
}

export interface ImagemUpload {
  nomeArquivo: string
  url: string
}

interface ListarImagensResponse {
  imagens: ImagemUpload[]
}

const uploadService = {
  uploadImagem: (arquivo: File): Promise<UploadResponse> => {
    const formData = new FormData()
    formData.append('arquivo', arquivo)
    return api.post(EP.UPLOAD.IMAGEM, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data)
  },

  deleteImagem: (nomeArquivo: string) => {
    return api.delete(EP.UPLOAD.REMOVE_IMAGEM(nomeArquivo)).then(r => r.data)
  },

  listarImagens: (): Promise<ImagemUpload[]> => {
    return api.get<ListarImagensResponse>(EP.UPLOAD.LIST_IMAGENS).then(r => r.data.imagens)
  },
}

export default uploadService

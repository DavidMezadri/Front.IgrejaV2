import api from '../api/client'
import { EP } from '../api/endpoints'

interface PessoaEndereco {
  id?: number
  pessoaId?: number
  enderecoId: number
  endereco?: any
}

const pessoaEnderecoService = {
  list: (pessoaId: string | number) =>
    api.get(EP.PESSOAS_ENDERECOS.LIST(pessoaId)).then(r => r.data),

  add: (pessoaId: number, enderecoId: number, principal: boolean = false) =>
    api.post(EP.PESSOAS_ENDERECOS.ADD, { pessoaId, enderecoId, principal }).then(r => r.data),

  remove: (pessoaEnderecoId: string | number) =>
    api.delete(EP.PESSOAS_ENDERECOS.REMOVE(pessoaEnderecoId)).then(r => r.data),
}

export default pessoaEnderecoService
export type { PessoaEndereco }

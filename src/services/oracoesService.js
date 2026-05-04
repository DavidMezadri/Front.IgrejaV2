// TODO: replace with real API endpoint when available
import { DATA } from '../data/mockData'

const oracoesService = {
  list: () => Promise.resolve(DATA.oracoes),
}

export default oracoesService

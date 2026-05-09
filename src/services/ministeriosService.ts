// TODO: replace with real API endpoint when available
import { DATA } from '../data/mockData'

const ministeriosService = {
  list: () => Promise.resolve(DATA.ministerios),
}

export default ministeriosService

// TODO: replace with real API endpoint when available
import { DATA } from '../data/mockData'

const avisosService = {
  list: () => Promise.resolve(DATA.avisos),
}

export default avisosService

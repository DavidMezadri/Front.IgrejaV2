// TODO: replace with real API endpoint when available
import { DATA } from '../data/mockData'

const sermoesService = {
  list: () => Promise.resolve(DATA.sermoes),
}

export default sermoesService

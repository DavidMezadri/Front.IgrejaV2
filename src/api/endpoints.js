export const EP = {
  AUTH: {
    LOGIN:  '/api/auth/login',
    ME:     '/api/auth/me',
    LOGOUT: '/api/auth/logout',
  },
  EVENTOS: {
    LIST:       '/api/eventos',
    ONE:        id => `/api/eventos/${id}`,
    CREATE:     '/api/eventos',
    UPDATE:     id => `/api/eventos/${id}`,
    REMOVE:     id => `/api/eventos/${id}`,
  },
  TIPOS_EVENTO: {
    LIST: '/api/tipos-evento',
  },
  PESSOAS: {
    LIST:   '/api/pessoas',
    ONE:    id => `/api/pessoas/${id}`,
    CREATE: '/api/pessoas',
    UPDATE: id => `/api/pessoas/${id}`,
    REMOVE: id => `/api/pessoas/${id}`,
  },
  FAMILIAS: {
    LIST:   '/api/familias',
    ONE:    id => `/api/familias/${id}`,
  },
  PRESENCAS: {
    LIST:   '/api/presencas',
    CREATE: '/api/presencas',
  },
  USUARIOS: {
    LIST:   '/api/usuarios',
    ONE:    id => `/api/usuarios/${id}`,
    UPDATE: id => `/api/usuarios/${id}`,
  },
}

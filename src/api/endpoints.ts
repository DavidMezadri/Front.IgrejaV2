type EndpointId = (id: string | number) => string

export const EP = {
  AUTH: {
    LOGIN:    '/api/auth/login',
    REGISTER: '/api/auth/register',
    ME:       '/api/auth/me',
    LOGOUT:   '/api/auth/logout',
  },
  EVENTOS: {
    LIST:       '/api/eventos',
    ONE:        ((id: string | number) => `/api/eventos/${id}`) as EndpointId,
    CREATE:     '/api/eventos',
    UPDATE:     ((id: string | number) => `/api/eventos/${id}`) as EndpointId,
    REMOVE:     ((id: string | number) => `/api/eventos/${id}`) as EndpointId,
  },
  TIPOS_EVENTO: {
    LIST: '/api/tipos-evento',
  },
  PESSOAS: {
    LIST:   '/api/pessoas',
    ONE:    ((id: string | number) => `/api/pessoas/${id}`) as EndpointId,
    CREATE: '/api/pessoas',
    UPDATE: ((id: string | number) => `/api/pessoas/${id}`) as EndpointId,
    REMOVE: ((id: string | number) => `/api/pessoas/${id}`) as EndpointId,
  },
  FAMILIAS: {
    LIST:   '/api/familias',
    ONE:    ((id: string | number) => `/api/familias/${id}`) as EndpointId,
  },
  PRESENCAS: {
    LIST:   '/api/presencas',
    CREATE: '/api/presencas',
  },
  USUARIOS: {
    LIST:   '/api/usuarios',
    ONE:    ((id: string | number) => `/api/usuarios/${id}`) as EndpointId,
    UPDATE: ((id: string | number) => `/api/usuarios/${id}`) as EndpointId,
    REMOVE: ((id: string | number) => `/api/usuarios/${id}`) as EndpointId,
  },
  CONFIG: {
    LIST: '/api/config',
    UPDATE: '/api/config',
  },
  TRADUCOES: {
    LIST:   '/api/traducoes',
    ONE:    ((id: string | number) => `/api/traducoes/${id}`) as EndpointId,
    CREATE: '/api/traducoes',
    UPDATE: ((id: string | number) => `/api/traducoes/${id}`) as EndpointId,
    REMOVE: ((id: string | number) => `/api/traducoes/${id}`) as EndpointId,
  },
  VERSICULOS: {
    LIST:   '/api/versiculos',
    ONE:    ((id: string | number) => `/api/versiculos/${id}`) as EndpointId,
    CREATE: '/api/versiculos',
    UPDATE: ((id: string | number) => `/api/versiculos/${id}`) as EndpointId,
    REMOVE: ((id: string | number) => `/api/versiculos/${id}`) as EndpointId,
  },
}

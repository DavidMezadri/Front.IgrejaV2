type EndpointId = (id: string | number) => string

export const EP = {
  AUTH: {
    LOGIN:  '/api/auth/login',
    ME:     '/api/auth/me',
    LOGOUT: '/api/auth/logout',
  },
  EVENTOS: {
    LIST:       '/api/eventos',
    ONE:        ((id: string | number) => `/api/eventos/${id}`) as EndpointId,
    CREATE:     '/api/eventos',
    UPDATE:     ((id: string | number) => `/api/eventos/${id}`) as EndpointId,
    REMOVE:     ((id: string | number) => `/api/eventos/${id}`) as EndpointId,
    ATIVOS:     '/api/eventos/ativos',
  },
  TIPOS_EVENTO: {
    LIST:   '/api/tipos-evento',
    ONE:    ((id: string | number) => `/api/tipos-evento/${id}`) as EndpointId,
    CREATE: '/api/tipos-evento',
    UPDATE: ((id: string | number) => `/api/tipos-evento/${id}`) as EndpointId,
    REMOVE: ((id: string | number) => `/api/tipos-evento/${id}`) as EndpointId,
  },
  PESSOAS: {
    LIST:   '/api/pessoas',
    ONE:    ((id: string | number) => `/api/pessoas/${id}`) as EndpointId,
    CREATE: '/api/pessoas',
    UPDATE: ((id: string | number) => `/api/pessoas/${id}`) as EndpointId,
    REMOVE: ((id: string | number) => `/api/pessoas/${id}`) as EndpointId,
    SEARCH: '/api/pessoas/buscar',
  },
  FAMILIAS: {
    LIST:   '/api/familias',
    ONE:    ((id: string | number) => `/api/familias/${id}`) as EndpointId,
    CREATE: '/api/familias',
    UPDATE: ((id: string | number) => `/api/familias/${id}`) as EndpointId,
    REMOVE: ((id: string | number) => `/api/familias/${id}`) as EndpointId,
    SEARCH: '/api/familias/buscar',
  },
  PRESENCAS: {
    LIST:      '/api/presencas',
    ONE:       ((id: string | number) => `/api/presencas/${id}`) as EndpointId,
    CREATE:    '/api/presencas',
    UPDATE:    ((id: string | number) => `/api/presencas/${id}`) as EndpointId,
    REMOVE:    ((id: string | number) => `/api/presencas/${id}`) as EndpointId,
    BY_EVENTO: ((eventoId: string | number) => `/api/presencas/evento/${eventoId}`) as EndpointId,
    BY_PESSOA: ((pessoaId: string | number) => `/api/presencas/pessoa/${pessoaId}`) as EndpointId,
  },
  USUARIOS: {
    LIST:   '/api/usuarios',
    ONE:    ((id: string | number) => `/api/usuarios/${id}`) as EndpointId,
    CREATE: '/api/usuarios',
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
  UPLOAD: {
    IMAGEM:        '/api/upload/imagem',
    REMOVE_IMAGEM: ((nomeArquivo: string) => `/api/upload/imagem/${nomeArquivo}`) as EndpointId,
    LIST_IMAGENS:  '/api/upload/imagens',
  },
}

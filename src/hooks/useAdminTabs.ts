import { useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { ADMIN_TABS, TipoUsuarioEnum } from '../config/userTypes'

interface AdminTab {
  path: string
  label: string
}

const ALL_TABS: Record<string, string> = {
  igrejas: 'Igrejas',
  enderecos: 'Endereços',
  pessoas: 'Pessoas',
  familias: 'Famílias',
  'tipos-evento': 'Tipos de Evento',
  eventos: 'Eventos',
  presencas: 'Presenças',
  usuarios: 'Usuários',
  configuracoes: 'Configurações',
  cms: 'CMS',
  traducoes: 'Traduções',
  versiculos: 'Versículos',
}

export function useAdminTabs(): AdminTab[] {
  const { user } = useAuth()

  return useMemo(() => {
    if (!user) return []

    const tipoUsuario = user.tipoUsuario as TipoUsuarioEnum
    const allowedTabs = ADMIN_TABS[tipoUsuario] || []

    return allowedTabs.map(tabPath => ({
      path: `/admin/${tabPath}`,
      label: ALL_TABS[tabPath] || tabPath,
    }))
  }, [user])
}

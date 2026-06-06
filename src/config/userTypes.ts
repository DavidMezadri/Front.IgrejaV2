export enum TipoUsuarioEnum {
  Administrador = 0,
  Pastor = 1,
  Presidente = 2,
  Comissao = 3,
  Membro = 4,
  Visitante = 5,
}

export const USER_TYPE_LABELS: Record<TipoUsuarioEnum | number, string> = {
  [TipoUsuarioEnum.Administrador]: 'Administrador',
  [TipoUsuarioEnum.Pastor]: 'Pastor',
  [TipoUsuarioEnum.Presidente]: 'Presidente',
  [TipoUsuarioEnum.Comissao]: 'Comissão',
  [TipoUsuarioEnum.Membro]: 'Membro',
  [TipoUsuarioEnum.Visitante]: 'Visitante',
}

export const ADMIN_AREA_LABELS: Record<TipoUsuarioEnum | number, string> = {
  [TipoUsuarioEnum.Administrador]: 'Área Admin',
  [TipoUsuarioEnum.Pastor]: 'Painel do Pastor',
  [TipoUsuarioEnum.Presidente]: 'Painel do Presidente',
  [TipoUsuarioEnum.Comissao]: 'Painel da Comissão',
  [TipoUsuarioEnum.Membro]: 'Minha Área',
  [TipoUsuarioEnum.Visitante]: 'Minha Área',
}

export const ADMIN_TABS: Record<TipoUsuarioEnum | number, string[]> = {
  [TipoUsuarioEnum.Administrador]: [
    'igrejas',
    'enderecos',
    'pessoas',
    'familias',
    'tipos-evento',
    'eventos',
    'presencas',
    'usuarios',
    'configuracoes',
    'cms',
    'traducoes',
    'versiculos',
  ],
  [TipoUsuarioEnum.Pastor]: [
    'eventos',
    'presencas',
    'usuarios',
  ],
  [TipoUsuarioEnum.Presidente]: [
    'eventos',
    'presencas',
  ],
  [TipoUsuarioEnum.Comissao]: [
    'eventos',
    'presencas',
  ],
  [TipoUsuarioEnum.Membro]: [],
  [TipoUsuarioEnum.Visitante]: [],
}

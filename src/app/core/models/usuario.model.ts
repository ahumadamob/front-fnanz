export type MonedaBase =
  | 'ARS'
  | 'USD'
  | 'EUR'
  | 'BRL'
  | 'CLP'
  | 'UYU'
  | 'PYG'
  | 'BOB'
  | 'PEN';

export interface UsuarioResponse {
  id: number;
  nombre: string;
  email: string;
  monedaBase: MonedaBase;
  creadoEn: string;
  actualizadoEn: string;
}

export interface UsuarioCreate {
  nombre?: string;
  email?: string;
  password?: string;
  monedaBase?: MonedaBase;
}

export interface UsuarioPatch {
  nombre?: string;
  monedaBase?: MonedaBase;
}

export interface UsuarioPasswordDto {
  actual: string;
  nueva: string;
}

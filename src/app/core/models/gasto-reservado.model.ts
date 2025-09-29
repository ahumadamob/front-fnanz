export type GastoReservadoTipo = 'INGRESO' | 'EGRESO';
export type GastoReservadoEstado = 'RESERVADO' | 'APLICADO' | 'CANCELADO';

export interface GastoReservadoResponse {
  id: number;
  tipo: GastoReservadoTipo;
  categoriaId: number;
  categoriaNombre: string;
  concepto: string;
  periodoFecha: string;
  fechaVencimiento: string;
  estado: GastoReservadoEstado;
  montoReservado: number;
  montoAplicado: number;
  nota?: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface GastoReservadoCreate {
  tipo?: GastoReservadoTipo;
  categoriaId?: number;
  concepto?: string;
  periodoFecha?: string;
  fechaVencimiento?: string;
  estado?: GastoReservadoEstado;
  montoReservado?: number;
  montoAplicado?: number;
  nota?: string;
}

export interface GastoReservadoPatch extends GastoReservadoCreate {}

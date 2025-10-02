export interface GastoReservado {
  id: number;
  tipo: 'INGRESO' | 'EGRESO';
  categoriaId: number;
  categoriaNombre: string;
  concepto: string;
  periodoId: number;
  periodoNombre: string;
  periodoFechaInicio: string;
  periodoFechaFin: string;
  estado: 'RESERVADO' | 'APLICADO' | 'CANCELADO';
  montoReservado: number;
  montoAplicado?: number | null;
  nota?: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

export type GastoReservadoCreate = {
  tipo: GastoReservado['tipo'];
  categoriaId: number;
  concepto: string;
  periodoId: number;
  estado: GastoReservado['estado'];
  montoReservado: number;
  montoAplicado?: number | null;
  nota?: string;
};

export type GastoReservadoUpdate = Partial<GastoReservadoCreate>;

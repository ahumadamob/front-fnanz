export interface GastoReservado {
  id: number;
  tipo: 'INGRESO' | 'EGRESO';
  categoriaId: number;
  categoriaNombre: string;
  concepto: string;
  periodoFecha: string;
  fechaVencimiento?: string | null;
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
  periodoFecha: string;
  estado: GastoReservado['estado'];
  montoReservado: number;
  fechaVencimiento?: string | null;
  montoAplicado?: number | null;
  nota?: string;
};

export type GastoReservadoUpdate = Partial<GastoReservadoCreate>;

export interface PartidaPresupuestaria {
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

export type PartidaPresupuestariaCreate = {
  tipo: PartidaPresupuestaria['tipo'];
  categoriaId: number;
  concepto: string;
  periodoId: number;
  estado: PartidaPresupuestaria['estado'];
  montoReservado: number;
  montoAplicado?: number | null;
  nota?: string;
};

export type PartidaPresupuestariaUpdate = Partial<PartidaPresupuestariaCreate>;

export interface PartidaPresupuestariaApplyPayload {
  montoAplicado: number;
}

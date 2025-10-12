export interface PeriodoFinanciero {
  id: number;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  tipo?: string | null;
  descripcion?: string | null;
  cerrado: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export type PeriodoFinancieroCreate = {
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  tipo?: string | null;
  descripcion?: string | null;
  cerrado?: boolean;
};

export type PeriodoFinancieroUpdate = Partial<PeriodoFinancieroCreate>;

export interface PeriodoFinancieroDropdown {
  id: number;
  nombre: string;
}

export interface PartidaPresupuestariaCategoriaResumen {
  categoriaId: number;
  categoriaNombre: string;
  tipo: 'INGRESO' | 'EGRESO';
  orden?: number | null;
  montoReservado: number;
  montoAplicado: number;
}

export interface PartidaPresupuestariaTotales {
  montoReservado: number;
  montoAplicado: number;
}

export type PartidaPresupuestariaCategoriaResumenDto =
  Partial<PartidaPresupuestariaCategoriaResumen>;

export interface PeriodoFinancieroPartidasResumenDto {
  ingresos?: PartidaPresupuestariaCategoriaResumenDto[] | null;
  totalIngresos?: PartidaPresupuestariaTotales | null;
  egresos?: PartidaPresupuestariaCategoriaResumenDto[] | null;
  totalEgresos?: PartidaPresupuestariaTotales | null;
  totalGeneral?: PartidaPresupuestariaTotales | null;
  netoReservado?: number | null;
  netoAplicado?: number | null;
}

export interface PeriodoFinancieroPartidasResumen {
  ingresos: PartidaPresupuestariaCategoriaResumen[];
  totalIngresos: PartidaPresupuestariaTotales;
  egresos: PartidaPresupuestariaCategoriaResumen[];
  totalEgresos: PartidaPresupuestariaTotales;
  totalGeneral: PartidaPresupuestariaTotales;
  netoReservado: number;
  netoAplicado: number;
}

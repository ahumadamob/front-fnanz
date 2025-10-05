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

export interface PeriodoFinancieroPartidasResumen {
  ingresos: PartidaPresupuestariaCategoriaResumen[];
  totalIngresos: PartidaPresupuestariaTotales;
  egresos: PartidaPresupuestariaCategoriaResumen[];
  totalEgresos: PartidaPresupuestariaTotales;
  totalGeneral: PartidaPresupuestariaTotales;
}

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

export interface CategoriaFinanciera {
  id: number;
  nombre: string;
  tipo: 'INGRESO' | 'EGRESO';
  activo: boolean;
  orden: number | null;
  descripcion: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

export type CategoriaFinancieraCreate = {
  nombre: string;
  tipo: CategoriaFinanciera['tipo'];
  activo: boolean;
  orden?: number | null;
  descripcion?: string | null;
};

export type CategoriaFinancieraUpdate = Partial<CategoriaFinancieraCreate>;

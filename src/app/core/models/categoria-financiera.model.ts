export type CategoriaFinancieraTipo = 'INGRESO' | 'EGRESO';

export interface CategoriaFinancieraResponse {
  id: number;
  nombre: string;
  tipo: CategoriaFinancieraTipo;
  activo: boolean;
  orden: number;
  descripcion?: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CategoriaFinancieraCreate {
  nombre?: string;
  tipo?: CategoriaFinancieraTipo;
  activo?: boolean;
  orden?: number;
  descripcion?: string;
}

export interface CategoriaFinancieraPatch extends CategoriaFinancieraCreate {}

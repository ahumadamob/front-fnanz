import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  PartidaPresupuestariaCategoriaResumen,
  PartidaPresupuestariaCategoriaResumenDto,
  PartidaPresupuestariaTotales,
  PeriodoFinanciero,
  PeriodoFinancieroCreate,
  PeriodoFinancieroDropdown,
  PeriodoFinancieroPartidasResumen,
  PeriodoFinancieroPartidasResumenDto,
  PeriodoFinancieroUpdate
} from '../../shared/models/periodo-financiero.model';
import { ApiHttpService } from './api-http.service';

interface ApiResponse<T> {
  message: string;
  data: T;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class PeriodoFinancieroService {
  private readonly apiHttp = inject(ApiHttpService);
  private readonly basePath = '/api/periodos-financieros';

  list(query?: string): Observable<PeriodoFinanciero[]> {
    const params: Record<string, unknown> = {
      'pageable.page': 0,
      'pageable.size': 50
    };

    if (query) {
      params['q'] = query;
    }

    return this.apiHttp
      .get<ApiResponse<PeriodoFinanciero[]>>(this.basePath, { params })
      .pipe(map((response) => response.data ?? []));
  }

  dropdown(soloAbiertos: boolean): Observable<PeriodoFinancieroDropdown[]> {
    const params = soloAbiertos ? { soloAbiertos: true } : {};

    return this.apiHttp
      .get<ApiResponse<PeriodoFinancieroDropdown[]>>(
        `${this.basePath}/dropdown`,
        { params }
      )
      .pipe(map((response) => response.data ?? []));
  }

  create(payload: PeriodoFinancieroCreate): Observable<PeriodoFinanciero> {
    return this.apiHttp
      .post<ApiResponse<PeriodoFinanciero>>(this.basePath, payload)
      .pipe(map((response) => response.data));
  }

  update(id: number, payload: PeriodoFinancieroUpdate): Observable<PeriodoFinanciero> {
    return this.apiHttp
      .patch<ApiResponse<PeriodoFinanciero>>(`${this.basePath}/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  delete(id: number): Observable<void> {
    return this.apiHttp.delete<void>(`${this.basePath}/${id}`);
  }

  getPartidasResumen(
    id: number
  ): Observable<PeriodoFinancieroPartidasResumen | null> {
    return this.apiHttp
      .get<ApiResponse<PeriodoFinancieroPartidasResumenDto | null>>(
        `${this.basePath}/${id}/partidas-resumen`
      )
      .pipe(map((response) => this.mapPartidasResumen(response.data)));
  }

  private mapPartidasResumen(
    dto: PeriodoFinancieroPartidasResumenDto | null | undefined
  ): PeriodoFinancieroPartidasResumen | null {
    if (!dto) {
      return null;
    }

    const sanitizeTotales = (
      totals: PartidaPresupuestariaTotales | null | undefined
    ): PartidaPresupuestariaTotales => ({
      montoReservado:
        typeof totals?.montoReservado === 'number' && !Number.isNaN(totals.montoReservado)
          ? totals.montoReservado
          : 0,
      montoAplicado:
        typeof totals?.montoAplicado === 'number' && !Number.isNaN(totals.montoAplicado)
          ? totals.montoAplicado
          : 0
    });

    const sanitizeCategorias = (
      categorias: PartidaPresupuestariaCategoriaResumenDto[] | null | undefined
    ): PartidaPresupuestariaCategoriaResumen[] =>
      (categorias ?? []).map((categoria) => ({
        categoriaId:
          typeof categoria.categoriaId === 'number' && !Number.isNaN(categoria.categoriaId)
            ? categoria.categoriaId
            : 0,
        categoriaNombre: categoria.categoriaNombre ?? '',
        tipo: categoria.tipo === 'EGRESO' ? 'EGRESO' : 'INGRESO',
        orden:
          typeof categoria.orden === 'number' && !Number.isNaN(categoria.orden)
            ? categoria.orden
            : categoria.orden ?? null,
        montoReservado:
          typeof categoria.montoReservado === 'number' && !Number.isNaN(categoria.montoReservado)
            ? categoria.montoReservado
            : 0,
        montoAplicado:
          typeof categoria.montoAplicado === 'number' && !Number.isNaN(categoria.montoAplicado)
            ? categoria.montoAplicado
            : 0
      }));

    const sanitizeNumber = (value: number | null | undefined): number =>
      typeof value === 'number' && !Number.isNaN(value) ? value : 0;

    return {
      ingresos: sanitizeCategorias(dto.ingresos),
      totalIngresos: sanitizeTotales(dto.totalIngresos),
      egresos: sanitizeCategorias(dto.egresos),
      totalEgresos: sanitizeTotales(dto.totalEgresos),
      totalGeneral: sanitizeTotales(dto.totalGeneral),
      netoReservado: sanitizeNumber(dto.netoReservado),
      netoAplicado: sanitizeNumber(dto.netoAplicado)
    };
  }
}

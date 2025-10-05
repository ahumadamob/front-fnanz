import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  PartidaPresupuestaria,
  PartidaPresupuestariaApplyPayload,
  PartidaPresupuestariaCreate,
  PartidaPresupuestariaUpdate
} from '../../shared/models/partida-presupuestaria.model';
import { ApiHttpService } from './api-http.service';

interface ApiResponse<T> {
  message: string;
  data: T;
  timestamp: string;
}

interface PartidaPresupuestariaPage {
  content: PartidaPresupuestaria[];
  pageable?: unknown;
  totalElements?: number;
  totalPages?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PartidaPresupuestariaService {
  private readonly apiHttp = inject(ApiHttpService);
  private readonly basePath = '/api/partidas-presupuestarias';

  list(query?: string): Observable<PartidaPresupuestaria[]> {
    const params: Record<string, unknown> = {
      'pageable.page': 0,
      'pageable.size': 50
    };

    if (query) {
      params['q'] = query;
    }

    return this.apiHttp
      .get<ApiResponse<PartidaPresupuestariaPage | null>>(this.basePath, {
        params
      })
      .pipe(map((response) => response.data?.content ?? []));
  }

  listByPeriodo(periodoId: number): Observable<PartidaPresupuestaria[]> {
    return this.apiHttp
      .get<ApiResponse<PartidaPresupuestaria[]>>(
        `${this.basePath}/periodo/${periodoId}`
      )
      .pipe(map((response) => response.data ?? []));
  }

  create(payload: PartidaPresupuestariaCreate): Observable<PartidaPresupuestaria> {
    return this.apiHttp
      .post<ApiResponse<PartidaPresupuestaria>>(this.basePath, payload)
      .pipe(map((response) => response.data));
  }

  update(
    id: number,
    payload: PartidaPresupuestariaUpdate
  ): Observable<PartidaPresupuestaria> {
    return this.apiHttp
      .patch<ApiResponse<PartidaPresupuestaria>>(`${this.basePath}/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  apply(
    id: number,
    payload: PartidaPresupuestariaApplyPayload
  ): Observable<PartidaPresupuestaria> {
    return this.apiHttp
      .patch<ApiResponse<PartidaPresupuestaria>>(`${this.basePath}/${id}/aplicar`, payload)
      .pipe(map((response) => response.data));
  }

  delete(id: number): Observable<void> {
    return this.apiHttp.delete<void>(`${this.basePath}/${id}`);
  }
}

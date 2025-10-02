import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  PeriodoFinanciero,
  PeriodoFinancieroCreate,
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
}

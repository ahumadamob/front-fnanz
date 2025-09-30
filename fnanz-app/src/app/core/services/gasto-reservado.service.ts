import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  GastoReservado,
  GastoReservadoCreate,
  GastoReservadoUpdate
} from '../../shared/models/gasto-reservado.model';
import { ApiHttpService } from './api-http.service';

interface ApiResponse<T> {
  message: string;
  data: T;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class GastoReservadoService {
  private readonly apiHttp = inject(ApiHttpService);
  private readonly basePath = '/api/gastos-reservados';

  list(query?: string): Observable<GastoReservado[]> {
    const params: Record<string, unknown> = {
      'pageable.page': 0,
      'pageable.size': 50
    };

    if (query) {
      params['q'] = query;
    }

    return this.apiHttp
      .get<ApiResponse<GastoReservado[]>>(this.basePath, { params })
      .pipe(map((response) => response.data ?? []));
  }

  create(payload: GastoReservadoCreate): Observable<GastoReservado> {
    return this.apiHttp
      .post<ApiResponse<GastoReservado>>(this.basePath, payload)
      .pipe(map((response) => response.data));
  }

  update(id: number, payload: GastoReservadoUpdate): Observable<GastoReservado> {
    return this.apiHttp
      .patch<ApiResponse<GastoReservado>>(`${this.basePath}/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  delete(id: number): Observable<void> {
    return this.apiHttp.delete<void>(`${this.basePath}/${id}`);
  }
}

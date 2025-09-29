import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  CategoriaFinanciera,
  CategoriaFinancieraCreate,
  CategoriaFinancieraUpdate
} from '../../shared/models/categoria-financiera.model';
import { ApiHttpService } from './api-http.service';

interface ApiResponse<T> {
  message: string;
  data: T;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriaFinancieraService {
  private readonly apiHttp = inject(ApiHttpService);
  private readonly basePath = '/api/categorias-financieras';

  list(query?: string): Observable<CategoriaFinanciera[]> {
    const params: Record<string, unknown> = {
      'pageable.page': 0,
      'pageable.size': 50
    };

    if (query) {
      params['q'] = query;
    }

    return this.apiHttp
      .get<ApiResponse<CategoriaFinanciera[]>>(this.basePath, { params })
      .pipe(map((response) => response.data ?? []));
  }

  create(payload: CategoriaFinancieraCreate): Observable<CategoriaFinanciera> {
    return this.apiHttp
      .post<ApiResponse<CategoriaFinanciera>>(this.basePath, payload)
      .pipe(map((response) => response.data));
  }

  update(id: number, payload: CategoriaFinancieraUpdate): Observable<CategoriaFinanciera> {
    return this.apiHttp
      .patch<ApiResponse<CategoriaFinanciera>>(`${this.basePath}/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  delete(id: number): Observable<void> {
    return this.apiHttp.delete<void>(`${this.basePath}/${id}`);
  }
}

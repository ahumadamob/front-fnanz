import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiResponseSuccess } from '../models/api-response.model';
import {
  CategoriaFinancieraCreate,
  CategoriaFinancieraPatch,
  CategoriaFinancieraResponse
} from '../models/categoria-financiera.model';
import { PageRequestParams } from '../models/pageable.model';
import { environment } from '../../../environments/environment';
import { buildPageRequestParams } from './request-params.util';

@Injectable({
  providedIn: 'root'
})
export class CategoriaFinancieraService {
  private readonly resourceUrl = `${environment.apiUrl}/api/categorias-financieras`;

  constructor(private readonly http: HttpClient) {}

  list(params?: PageRequestParams): Observable<ApiResponseSuccess<CategoriaFinancieraResponse[]>> {
    const httpParams = buildPageRequestParams(params);
    return this.http.get<ApiResponseSuccess<CategoriaFinancieraResponse[]>>(this.resourceUrl, {
      params: httpParams
    });
  }

  getById(id: number): Observable<ApiResponseSuccess<CategoriaFinancieraResponse>> {
    return this.http.get<ApiResponseSuccess<CategoriaFinancieraResponse>>(`${this.resourceUrl}/${id}`);
  }

  create(payload: CategoriaFinancieraCreate): Observable<ApiResponseSuccess<CategoriaFinancieraResponse>> {
    return this.http.post<ApiResponseSuccess<CategoriaFinancieraResponse>>(this.resourceUrl, payload);
  }

  update(id: number, payload: CategoriaFinancieraPatch): Observable<ApiResponseSuccess<CategoriaFinancieraResponse>> {
    return this.http.patch<ApiResponseSuccess<CategoriaFinancieraResponse>>(`${this.resourceUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.resourceUrl}/${id}`);
  }
}

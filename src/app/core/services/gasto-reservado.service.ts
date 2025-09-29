import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiResponseSuccess } from '../models/api-response.model';
import {
  GastoReservadoCreate,
  GastoReservadoPatch,
  GastoReservadoResponse
} from '../models/gasto-reservado.model';
import { PageRequestParams } from '../models/pageable.model';
import { environment } from '../../../environments/environment';
import { buildPageRequestParams } from './request-params.util';

@Injectable({
  providedIn: 'root'
})
export class GastoReservadoService {
  private readonly resourceUrl = `${environment.apiUrl}/api/gastos-reservados`;

  constructor(private readonly http: HttpClient) {}

  list(params?: PageRequestParams): Observable<ApiResponseSuccess<GastoReservadoResponse[]>> {
    const httpParams = buildPageRequestParams(params);
    return this.http.get<ApiResponseSuccess<GastoReservadoResponse[]>>(this.resourceUrl, {
      params: httpParams
    });
  }

  getById(id: number): Observable<ApiResponseSuccess<GastoReservadoResponse>> {
    return this.http.get<ApiResponseSuccess<GastoReservadoResponse>>(`${this.resourceUrl}/${id}`);
  }

  create(payload: GastoReservadoCreate): Observable<ApiResponseSuccess<GastoReservadoResponse>> {
    return this.http.post<ApiResponseSuccess<GastoReservadoResponse>>(this.resourceUrl, payload);
  }

  update(id: number, payload: GastoReservadoPatch): Observable<ApiResponseSuccess<GastoReservadoResponse>> {
    return this.http.patch<ApiResponseSuccess<GastoReservadoResponse>>(`${this.resourceUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.resourceUrl}/${id}`);
  }
}

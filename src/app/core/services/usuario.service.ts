import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiResponseSuccess } from '../models/api-response.model';
import {
  UsuarioCreate,
  UsuarioPatch,
  UsuarioPasswordDto,
  UsuarioResponse
} from '../models/usuario.model';
import { PageRequestParams } from '../models/pageable.model';
import { environment } from '../../../environments/environment';
import { buildPageRequestParams } from './request-params.util';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly resourceUrl = `${environment.apiUrl}/api/usuarios`;

  constructor(private readonly http: HttpClient) {}

  list(params?: PageRequestParams): Observable<ApiResponseSuccess<UsuarioResponse[]>> {
    const httpParams = buildPageRequestParams(params);
    return this.http.get<ApiResponseSuccess<UsuarioResponse[]>>(this.resourceUrl, {
      params: httpParams
    });
  }

  getById(id: number): Observable<ApiResponseSuccess<UsuarioResponse>> {
    return this.http.get<ApiResponseSuccess<UsuarioResponse>>(`${this.resourceUrl}/${id}`);
  }

  create(payload: UsuarioCreate): Observable<ApiResponseSuccess<UsuarioResponse>> {
    return this.http.post<ApiResponseSuccess<UsuarioResponse>>(this.resourceUrl, payload);
  }

  update(id: number, payload: UsuarioPatch): Observable<ApiResponseSuccess<UsuarioResponse>> {
    return this.http.patch<ApiResponseSuccess<UsuarioResponse>>(`${this.resourceUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.resourceUrl}/${id}`);
  }

  changePassword(id: number, payload: UsuarioPasswordDto): Observable<void> {
    return this.http.post<void>(`${this.resourceUrl}/${id}/password`, payload);
  }

  me(): Observable<ApiResponseSuccess<UsuarioResponse>> {
    return this.http.get<ApiResponseSuccess<UsuarioResponse>>(`${this.resourceUrl}/me`);
  }
}

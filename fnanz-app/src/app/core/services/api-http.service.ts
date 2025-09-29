import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class ApiHttpService {
  private readonly http = inject(HttpClient);
  private readonly environment = inject(EnvironmentService);

  private buildUrl(endpoint: string): string {
    const normalized = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${this.environment.apiBaseUrl}/${normalized}`;
  }

  get<T>(endpoint: string, options?: object): Observable<T> {
    return this.http.get<T>(this.buildUrl(endpoint), options);
  }

  post<T>(endpoint: string, body: unknown, options?: object): Observable<T> {
    return this.http.post<T>(this.buildUrl(endpoint), body, options);
  }

  put<T>(endpoint: string, body: unknown, options?: object): Observable<T> {
    return this.http.put<T>(this.buildUrl(endpoint), body, options);
  }

  patch<T>(endpoint: string, body: unknown, options?: object): Observable<T> {
    return this.http.patch<T>(this.buildUrl(endpoint), body, options);
  }

  delete<T>(endpoint: string, options?: object): Observable<T> {
    return this.http.delete<T>(this.buildUrl(endpoint), options);
  }
}

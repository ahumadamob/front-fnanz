import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, switchMap } from 'rxjs';

import { ApiHttpService } from '../../core/services/api-http.service';
import { SystemHealth } from '../../shared/models/system-health.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly api = inject(ApiHttpService);
  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);

  loadSystemHealth(): Observable<SystemHealth[]> {
    return this.refreshTrigger$.pipe(
      switchMap(() =>
        this.api.get<SystemHealth[]>('system/health').pipe(
          map((response) => (response && response.length ? response : this.buildMockResponse())),
          catchError((error) => {
            console.error('Error al cargar el estado del sistema', error);
            return of(this.buildMockResponse());
          })
        )
      )
    );
  }

  refresh(): void {
    this.refreshTrigger$.next();
  }

  private buildMockResponse(): SystemHealth[] {
    const now = new Date().toISOString();
    return [
      {
        name: 'Core Identity',
        status: 'UP',
        lastCheckedAt: now,
        notes: 'Servicio funcionando correctamente.'
      },
      {
        name: 'Pagos',
        status: 'DEGRADED',
        lastCheckedAt: now,
        notes: 'Latencia superior a lo esperado, investigando con el equipo DevOps.'
      },
      {
        name: 'Notificaciones',
        status: 'DOWN',
        lastCheckedAt: now,
        notes: 'Dependencia externa sin respuesta. Reintentando cada 60 segundos.'
      }
    ];
  }
}

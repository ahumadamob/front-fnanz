import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { catchError, map, of } from 'rxjs';

import { CategoriaFinancieraService } from '../../core/services/categoria-financiera.service';
import { GastoReservadoService } from '../../core/services/gasto-reservado.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { CategoriaFinancieraResponse } from '../../core/models/categoria-financiera.model';
import { GastoReservadoResponse } from '../../core/models/gasto-reservado.model';
import { UsuarioResponse } from '../../core/models/usuario.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, DatePipe, NgClass],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private readonly errorMessages = signal<string[]>([]);

  readonly errors = computed(() => this.errorMessages());

  readonly perfil$ = this.usuarioService
    .me()
    .pipe(
      map((response) => response.data),
      catchError(this.createErrorHandler<UsuarioResponse | null>('No fue posible recuperar el perfil del usuario.', null))
    );

  readonly usuarios$ = this.usuarioService
    .list({ pageable: { page: 0, size: 5 } })
    .pipe(
      map((response) => response.data),
      catchError(this.createErrorHandler<UsuarioResponse[]>('No fue posible cargar la lista de usuarios.', []))
    );

  readonly categorias$ = this.categoriaService
    .list({ pageable: { page: 0, size: 5 } })
    .pipe(
      map((response) => response.data),
      catchError(
        this.createErrorHandler<CategoriaFinancieraResponse[]>(
          'No fue posible cargar las categorías financieras.',
          []
        )
      )
    );

  readonly gastosReservados$ = this.gastoReservadoService
    .list({ pageable: { page: 0, size: 5 } })
    .pipe(
      map((response) => response.data),
      catchError(
        this.createErrorHandler<GastoReservadoResponse[]>(
          'No fue posible cargar los gastos reservados.',
          []
        )
      )
    );

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly categoriaService: CategoriaFinancieraService,
    private readonly gastoReservadoService: GastoReservadoService
  ) {}

  badgeClassForEstado(estado: GastoReservadoResponse['estado']): string {
    switch (estado) {
      case 'APLICADO':
        return 'badge badge--success';
      case 'CANCELADO':
        return 'badge badge--error';
      case 'RESERVADO':
      default:
        return 'badge badge--warn';
    }
  }

  private createErrorHandler<T>(message: string, fallbackValue: T) {
    return (error: unknown) => {
      console.error(error);
      this.errorMessages.update((errors) => [...errors, message]);
      return of(fallbackValue);
    };
  }
}

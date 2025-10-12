import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
  PartidaPresupuestariaCategoriaResumen,
  PeriodoFinancieroPartidasResumen
} from '../../../shared/models/periodo-financiero.model';
import { PeriodoFinancieroService } from '../../../core/services/periodo-financiero.service';

@Component({
  selector: 'app-periodo-partidas-resumen',
  standalone: true,
  imports: [CurrencyPipe, NgFor, NgIf, RouterLink],
  templateUrl: './partidas-resumen.component.html',
  styleUrls: ['./partidas-resumen.component.scss']
})
export class PartidasResumenComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly periodoService = inject(PeriodoFinancieroService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly resumen = signal<PeriodoFinancieroPartidasResumen | null>(null);
  readonly periodoNombre = signal<string | null>(null);
  readonly periodoId = signal<number | null>(null);

  ngOnInit(): void {
    this.resolvePeriodoNombre();

    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      const id = idParam ? Number(idParam) : NaN;

      if (!idParam || Number.isNaN(id)) {
        this.error.set('El identificador del periodo no es válido.');
        this.periodoId.set(null);
        this.resumen.set(null);
        return;
      }

      this.periodoId.set(id);
      this.loadResumen(id);
    });
  }

  trackByCategoriaId = (
    _: number,
    categoria: PartidaPresupuestariaCategoriaResumen
  ): number =>
    categoria.categoriaId;

  private resolvePeriodoNombre(): void {
    const navigation = this.router.getCurrentNavigation();
    const nombreFromNavigation = navigation?.extras.state?.['periodoNombre'];

    if (typeof nombreFromNavigation === 'string' && nombreFromNavigation.trim()) {
      this.periodoNombre.set(nombreFromNavigation.trim());
      return;
    }

    if (typeof history !== 'undefined') {
      const nombreFromHistory = (history.state || {})['periodoNombre'];
      if (typeof nombreFromHistory === 'string' && nombreFromHistory.trim()) {
        this.periodoNombre.set(nombreFromHistory.trim());
      }
    }
  }

  private loadResumen(id: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.resumen.set(null);

    this.periodoService.getPartidasResumen(id).subscribe({
      next: (data) => {
        this.resumen.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el resumen de partidas presupuestarias.');
        this.loading.set(false);
      }
    });
  }
}

import { CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  PartidaPresupuestariaCategoriaResumen,
  PeriodoFinancieroDropdown,
  PeriodoFinancieroPartidasResumen
} from '../../shared/models/periodo-financiero.model';
import { PeriodoFinancieroService } from '../../core/services/periodo-financiero.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, NgClass, NgFor, NgIf, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private readonly periodoService = inject(PeriodoFinancieroService);

  readonly periodos = signal<PeriodoFinancieroDropdown[]>([]);
  readonly selectedPeriodoId = signal<number | null>(null);
  readonly selectedPeriodoNombre = computed(() => {
    const id = this.selectedPeriodoId();
    if (id === null) {
      return null;
    }

    return this.periodos().find((periodo) => periodo.id === id)?.nombre ?? null;
  });
  readonly loadingPeriodos = signal(false);
  readonly loadingResumen = signal(false);
  readonly periodosError = signal<string | null>(null);
  readonly resumenError = signal<string | null>(null);
  readonly resumen = signal<PeriodoFinancieroPartidasResumen | null>(null);

  ngOnInit(): void {
    this.loadPeriodos();
  }

  onPeriodoChange(value: string): void {
    if (!value) {
      return;
    }

    const id = Number(value);
    if (Number.isNaN(id) || this.selectedPeriodoId() === id) {
      return;
    }

    this.selectedPeriodoId.set(id);
    this.loadResumen(id);
  }

  trackByCategoriaId = (
    _: number,
    categoria: PartidaPresupuestariaCategoriaResumen
  ): number =>
    categoria.categoriaId;

  private loadPeriodos(): void {
    this.loadingPeriodos.set(true);
    this.periodosError.set(null);

    this.periodoService.dropdown(false).subscribe({
      next: (periodos) => {
        const periodosOrdenados = periodos ?? [];
        this.periodos.set(periodosOrdenados);
        this.loadingPeriodos.set(false);

        if (periodosOrdenados.length === 0) {
          this.selectedPeriodoId.set(null);
          this.resumen.set(null);
          return;
        }

        const currentId = this.selectedPeriodoId();
        const defaultId =
          currentId !== null && periodosOrdenados.some((periodo) => periodo.id === currentId)
            ? currentId
            : periodosOrdenados[0].id;

        this.selectedPeriodoId.set(defaultId);
        this.loadResumen(defaultId);
      },
      error: () => {
        this.loadingPeriodos.set(false);
        this.periodos.set([]);
        this.selectedPeriodoId.set(null);
        this.resumen.set(null);
        this.periodosError.set('No se pudieron cargar los periodos financieros.');
      }
    });
  }

  private loadResumen(id: number): void {
    this.loadingResumen.set(true);
    this.resumenError.set(null);
    this.resumen.set(null);

    this.periodoService.getPartidasResumen(id).subscribe({
      next: (data) => {
        this.resumen.set(data);
        this.loadingResumen.set(false);
      },
      error: () => {
        this.loadingResumen.set(false);
        this.resumen.set(null);
        this.resumenError.set('No se pudo cargar el resumen de partidas presupuestarias.');
      }
    });
  }
}

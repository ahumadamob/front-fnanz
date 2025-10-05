import { DatePipe, DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CategoriaFinanciera } from '../../shared/models/categoria-financiera.model';
import {
  PartidaPresupuestaria,
  PartidaPresupuestariaCreate
} from '../../shared/models/partida-presupuestaria.model';
import {
  PeriodoFinanciero,
  PeriodoFinancieroDropdown
} from '../../shared/models/periodo-financiero.model';
import { CategoriaFinancieraService } from '../../core/services/categoria-financiera.service';
import { PartidaPresupuestariaService } from '../../core/services/partida-presupuestaria.service';
import { PeriodoFinancieroService } from '../../core/services/periodo-financiero.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-partidas-presupuestarias',
  standalone: true,
  imports: [
    ConfirmDialogComponent,
    DatePipe,
    DecimalPipe,
    NgClass,
    NgFor,
    NgIf,
    ReactiveFormsModule,
  ],
  providers: [DecimalPipe],
  templateUrl: './partidas-presupuestarias.component.html',
  styleUrls: ['./partidas-presupuestarias.component.scss']
})
export class PartidasPresupuestariasComponent implements OnInit {
  private readonly selectedPeriodoStorageKey =
    'partidasPresupuestarias.selectedPeriodoId';
  private readonly partidaService = inject(PartidaPresupuestariaService);
  private readonly categoriaService = inject(CategoriaFinancieraService);
  private readonly periodoService = inject(PeriodoFinancieroService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly decimalPipe = inject(DecimalPipe);

  readonly partidas = signal<PartidaPresupuestaria[]>([]);
  readonly categorias = signal<CategoriaFinanciera[]>([]);
  readonly periodos = signal<PeriodoFinanciero[]>([]);
  readonly periodosDropdown = signal<PeriodoFinancieroDropdown[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly deleting = signal(false);
  readonly categoriasLoading = signal(false);
  readonly periodosLoading = signal(false);
  readonly periodosDropdownLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly categoriasError = signal<string | null>(null);
  readonly periodosError = signal<string | null>(null);
  readonly periodosDropdownError = signal<string | null>(null);
  readonly partidaPendingDelete = signal<PartidaPresupuestaria | null>(null);
  readonly viewingPartida = signal<PartidaPresupuestaria | null>(null);
  readonly showForm = signal(false);
  readonly selectedPeriodoId = signal<number | null>(null);
  readonly includePeriodosCerrados = signal(false);
  readonly cancelDialogOpen = signal(false);
  readonly applyingMonto = signal(false);
  readonly applyingMontoSaving = signal(false);
  readonly applyingMontoError = signal<string | null>(null);
  readonly tipoOptions: PartidaPresupuestaria['tipo'][] = ['INGRESO', 'EGRESO'];
  readonly form = this.formBuilder.nonNullable.group({
    tipo: ['EGRESO' as PartidaPresupuestaria['tipo'], Validators.required],
    categoriaId: this.formBuilder.control<number | null>(null, Validators.required),
    concepto: ['', [Validators.required, Validators.maxLength(120)]],
    periodoId: this.formBuilder.control<number | null>(null, Validators.required),
    estado: ['RESERVADO' as PartidaPresupuestaria['estado'], Validators.required],
    montoReservado: this.formBuilder.control<number | null>(null, [
      Validators.required,
      Validators.min(0)
    ]),
    montoAplicado: this.formBuilder.control<number | null>(null, [Validators.min(0)]),
    nota: ['', Validators.maxLength(500)]
  });
  readonly montoAplicadoControl = this.formBuilder.control<number | null>(null, [
    Validators.required,
    Validators.min(0)
  ]);

  readonly formTitle = computed(() => 'Nueva partida presupuestaria');

  readonly cancelDialogTitle = computed(() => 'Cancelar creación');

  readonly cancelDialogMessage = computed(
    () =>
      '¿Deseas cancelar la creación de la partida presupuestaria? Los cambios no guardados se perderán.'
  );

  readonly deleteMessage = computed(() => {
    const partida = this.partidaPendingDelete();
    return partida
      ? `¿Desea eliminar la partida presupuestaria "${partida.concepto}"?`
      : '';
  });

  ngOnInit(): void {
    this.restoreSelectedPeriodoId();
    this.loadCategorias();
    this.loadPeriodos();
    this.loadPeriodosDropdown();
  }

  trackByPartidaId = (_: number, partida: PartidaPresupuestaria): number => partida.id;

  private loadCategorias(): void {
    this.categoriasLoading.set(true);
    this.categoriasError.set(null);

    this.categoriaService.list().subscribe({
      next: (categorias) => {
        this.categorias.set(categorias);
        this.categoriasLoading.set(false);
      },
      error: () => {
        this.categoriasError.set('No se pudieron cargar las categorías.');
        this.categoriasLoading.set(false);
      }
    });
  }

  private loadPeriodos(): void {
    this.periodosLoading.set(true);
    this.periodosError.set(null);

    this.periodoService.list().subscribe({
      next: (periodos) => {
        this.periodos.set(periodos);
        this.periodosLoading.set(false);
      },
      error: () => {
        this.periodosError.set('No se pudieron cargar los periodos.');
        this.periodosLoading.set(false);
      }
    });
  }

  loadPartidas(): void {
    const periodoId = this.selectedPeriodoId();

    if (periodoId === null) {
      this.partidas.set([]);
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.partidaService.listByPeriodo(periodoId).subscribe({
      next: (partidas) => {
        this.partidas.set(partidas);
        const currentlyViewing = this.viewingPartida();
        if (currentlyViewing) {
          const updated =
            partidas.find((partida) => partida.id === currentlyViewing.id) ?? null;
          if (updated) {
            this.viewingPartida.set(updated);
          } else {
            this.resetApplyState();
            this.viewingPartida.set(null);
          }
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las partidas presupuestarias.');
        this.loading.set(false);
      }
    });
  }

  onPeriodoDropdownChange(value: string): void {
    let selectedPeriodoId: number | null = null;

    if (value) {
      const parsed = Number(value);
      selectedPeriodoId = Number.isNaN(parsed) ? null : parsed;
    }

    this.selectedPeriodoId.set(selectedPeriodoId);
    this.persistSelectedPeriodoId(selectedPeriodoId);
    this.resetApplyState();
    this.viewingPartida.set(null);

    if (this.showForm()) {
      if (selectedPeriodoId === null) {
        this.form.controls.periodoId.reset(null, { emitEvent: false });
      } else {
        this.form.controls.periodoId.setValue(selectedPeriodoId, {
          emitEvent: false
        });
      }
    }

    if (selectedPeriodoId === null) {
      this.partidas.set([]);
      this.loading.set(false);
      this.error.set(null);
      return;
    }

    this.loadPartidas();
  }

  onIncludePeriodosCerradosChange(checked: boolean): void {
    this.includePeriodosCerrados.set(checked);
    this.selectedPeriodoId.set(null);
    this.persistSelectedPeriodoId(null);
    this.partidas.set([]);
    this.error.set(null);
    this.resetApplyState();
    this.viewingPartida.set(null);
    if (this.showForm()) {
      this.form.controls.periodoId.reset(null, { emitEvent: false });
    }
    this.loadPeriodosDropdown();
  }

  startCreate(): void {
    const periodoId = this.selectedPeriodoId();

    if (periodoId === null) {
      this.error.set('Selecciona un periodo antes de crear una partida presupuestaria.');
      return;
    }

    this.resetApplyState();
    this.viewingPartida.set(null);
    this.form.reset({
      tipo: 'EGRESO',
      categoriaId: null,
      concepto: '',
      periodoId,
      estado: 'RESERVADO',
      montoReservado: null,
      montoAplicado: null,
      nota: ''
    });
    this.form.controls.periodoId.disable({ emitEvent: false });
    this.showForm.set(true);
  }

  promptCancelForm(): void {
    this.resetApplyState();
    this.viewingPartida.set(null);
    if (this.saving()) {
      return;
    }

    this.cancelDialogOpen.set(true);
  }

  closeCancelDialog(): void {
    this.cancelDialogOpen.set(false);
  }

  confirmCancelForm(): void {
    this.resetFormState();
    this.cancelDialogOpen.set(false);
  }

  submitForm(): void {
    this.clearFormErrors();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.error.set(null);
    const formValue = this.form.getRawValue();

    const payload: PartidaPresupuestariaCreate = {
      tipo: formValue.tipo,
      categoriaId: Number(formValue.categoriaId),
      concepto: formValue.concepto.trim(),
      periodoId: Number(formValue.periodoId),
      estado: formValue.estado,
      montoReservado: Number(formValue.montoReservado)
    };

    if (formValue.nota?.trim()) {
      payload.nota = formValue.nota.trim();
    }

    if (formValue.montoAplicado !== null && formValue.montoAplicado !== undefined) {
      payload.montoAplicado = Number(formValue.montoAplicado);
    }

    this.saving.set(true);

    this.partidaService.create(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.form.controls.periodoId.enable({ emitEvent: false });
        this.loadPartidas();
      },
      error: (err) => {
        const handled = this.handleFormApiErrors(err);
        if (handled) {
          this.error.set('Revisa los errores marcados en el formulario.');
        } else {
          this.error.set('Ocurrió un error al guardar la partida presupuestaria.');
        }
        this.saving.set(false);
      }
    });
  }

  promptDelete(partida: PartidaPresupuestaria): void {
    this.resetApplyState();
    this.viewingPartida.set(null);
    this.partidaPendingDelete.set(partida);
  }

  closeDeleteDialog(): void {
    if (this.deleting()) {
      return;
    }

    this.partidaPendingDelete.set(null);
  }

  confirmDeletePartida(): void {
    const partida = this.partidaPendingDelete();

    if (!partida) {
      return;
    }

    this.deleting.set(true);
    this.error.set(null);

    this.loading.set(true);

    this.partidaService.delete(partida.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.partidaPendingDelete.set(null);
        this.loadPartidas();
      },
      error: () => {
        this.error.set('No se pudo eliminar la partida presupuestaria seleccionada.');
        this.deleting.set(false);
        this.partidaPendingDelete.set(null);
        this.loading.set(false);
      }
    });
  }

  startApplyMonto(partida: PartidaPresupuestaria): void {
    if (this.applyingMontoSaving()) {
      return;
    }

    this.applyingMontoError.set(null);
    this.montoAplicadoControl.reset(partida.montoReservado, { emitEvent: false });
    this.montoAplicadoControl.markAsPristine();
    this.montoAplicadoControl.markAsUntouched();
    this.applyingMonto.set(true);
  }

  cancelApplyMonto(): void {
    if (this.applyingMontoSaving()) {
      return;
    }

    this.resetApplyState();
  }

  confirmApplyMonto(partida: PartidaPresupuestaria): void {
    if (!this.applyingMonto()) {
      return;
    }

    this.montoAplicadoControl.markAsTouched();
    this.montoAplicadoControl.updateValueAndValidity();

    if (this.montoAplicadoControl.invalid) {
      return;
    }

    const montoAplicado = this.montoAplicadoControl.value;

    if (montoAplicado === null) {
      return;
    }

    this.applyingMontoSaving.set(true);
    this.applyingMontoError.set(null);

    this.partidaService
      .update(partida.id, {
        montoAplicado: Number(montoAplicado),
        estado: 'APLICADO'
      })
      .subscribe({
        next: (updatedPartida) => {
          this.updatePartidaInCollection(updatedPartida);
          this.viewingPartida.set(updatedPartida);
          this.resetApplyState();
        },
        error: () => {
          this.applyingMontoError.set('No se pudo aplicar el monto reservado.');
          this.applyingMontoSaving.set(false);
        }
      });
  }

  hasControlError(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[controlName];
    return control?.touched === true && control.invalid;
  }

  getServerError(controlName: keyof typeof this.form.controls): string | null {
    const control = this.form.controls[controlName];
    const apiError = control?.errors?.['api'];
    return typeof apiError === 'string' ? apiError : null;
  }

  private clearFormErrors(): void {
    Object.values(this.form.controls).forEach((control) => {
      if (!control.errors) {
        return;
      }

      const { api, ...otherErrors } = control.errors;
      if (api) {
        const hasOtherErrors = Object.keys(otherErrors).length > 0;
        control.setErrors(hasOtherErrors ? otherErrors : null);
      }
    });
  }

  private handleFormApiErrors(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
      return false;
    }

    const httpError = error as { status?: number; error?: unknown };
    if (!httpError.status || httpError.status < 400 || httpError.status >= 500) {
      return false;
    }

    const payload = httpError.error as
      | { messages?: { field: string; message: string }[] }
      | undefined;

    if (!payload?.messages?.length) {
      return false;
    }

    let applied = false;

    payload.messages.forEach(({ field, message }) => {
      const control = this.form.get(field);
      if (control) {
        const existingErrors = control.errors ?? {};
        control.setErrors({ ...existingErrors, api: message });
        control.markAsTouched();
        applied = true;
      }
    });

    return applied;
  }

  private resetFormState(): void {
    this.form.reset();
    this.form.controls.periodoId.enable({ emitEvent: false });
    this.showForm.set(false);
    this.resetApplyState();
    this.viewingPartida.set(null);
  }

  private loadPeriodosDropdown(): void {
    const soloAbiertos = !this.includePeriodosCerrados();
    this.periodosDropdownLoading.set(true);
    this.periodosDropdownError.set(null);

    this.periodoService.dropdown(soloAbiertos).subscribe({
      next: (periodos) => {
        this.periodosDropdown.set(periodos);
        const selectedId = this.selectedPeriodoId();
        const selectedStillExists = periodos.some(
          (periodo) => periodo.id === selectedId
        );

        if (!selectedStillExists) {
          this.selectedPeriodoId.set(null);
          this.persistSelectedPeriodoId(null);
          this.partidas.set([]);
          this.loading.set(false);
          this.error.set(null);
        } else if (selectedId !== null) {
          this.loadPartidas();
        }

        this.periodosDropdownLoading.set(false);
      },
      error: () => {
        this.periodosDropdown.set([]);
        this.periodosDropdownError.set('No se pudieron cargar los periodos para filtrar.');
        this.periodosDropdownLoading.set(false);
      }
    });
  }

  private restoreSelectedPeriodoId(): void {
    const storage = this.getStorage();
    if (!storage) {
      return;
    }

    const storedValue = storage.getItem(this.selectedPeriodoStorageKey);

    if (!storedValue) {
      return;
    }

    const parsed = Number(storedValue);

    if (Number.isNaN(parsed)) {
      return;
    }

    this.selectedPeriodoId.set(parsed);
  }

  private persistSelectedPeriodoId(value: number | null): void {
    const storage = this.getStorage();
    if (!storage) {
      return;
    }

    if (value === null) {
      storage.removeItem(this.selectedPeriodoStorageKey);
    } else {
      storage.setItem(this.selectedPeriodoStorageKey, String(value));
    }
  }

  private getStorage(): Storage | null {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      return window.localStorage;
    } catch {
      return null;
    }
  }

  formatAccounting(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return '—';
    }

    const absoluteValue = Math.abs(value);
    const formattedAbsolute =
      this.decimalPipe.transform(absoluteValue, '1.0-0') ?? absoluteValue.toString();

    return value < 0 ? `(${formattedAbsolute})` : formattedAbsolute;
  }

  viewPartida(partida: PartidaPresupuestaria): void {
    this.resetApplyState();
    this.viewingPartida.set(partida);
  }

  closeViewPartida(): void {
    this.resetApplyState();
    this.viewingPartida.set(null);
  }

  private resetApplyState(): void {
    this.applyingMonto.set(false);
    this.applyingMontoSaving.set(false);
    this.applyingMontoError.set(null);
    this.montoAplicadoControl.reset(null, { emitEvent: false });
    this.montoAplicadoControl.markAsPristine();
    this.montoAplicadoControl.markAsUntouched();
  }

  private updatePartidaInCollection(updatedPartida: PartidaPresupuestaria): void {
    this.partidas.update((current) =>
      current.map((partida) => (partida.id === updatedPartida.id ? updatedPartida : partida))
    );
    this.applyingMontoSaving.set(false);
  }
}

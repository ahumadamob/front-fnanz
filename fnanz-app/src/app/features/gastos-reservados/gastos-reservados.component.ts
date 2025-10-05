import { DatePipe, DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CategoriaFinanciera } from '../../shared/models/categoria-financiera.model';
import {
  GastoReservado,
  GastoReservadoCreate
} from '../../shared/models/gasto-reservado.model';
import {
  PeriodoFinanciero,
  PeriodoFinancieroDropdown
} from '../../shared/models/periodo-financiero.model';
import { CategoriaFinancieraService } from '../../core/services/categoria-financiera.service';
import { GastoReservadoService } from '../../core/services/gasto-reservado.service';
import { PeriodoFinancieroService } from '../../core/services/periodo-financiero.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-gastos-reservados',
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
  templateUrl: './gastos-reservados.component.html',
  styleUrls: ['./gastos-reservados.component.scss']
})
export class GastosReservadosComponent implements OnInit {
  private readonly gastoService = inject(GastoReservadoService);
  private readonly categoriaService = inject(CategoriaFinancieraService);
  private readonly periodoService = inject(PeriodoFinancieroService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly decimalPipe = inject(DecimalPipe);

  readonly gastos = signal<GastoReservado[]>([]);
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
  readonly gastoPendingDelete = signal<GastoReservado | null>(null);
  readonly viewingGasto = signal<GastoReservado | null>(null);
  readonly showForm = signal(false);
  readonly selectedPeriodoId = signal<number | null>(null);
  readonly includePeriodosCerrados = signal(false);
  readonly cancelDialogOpen = signal(false);
  readonly tipoOptions: GastoReservado['tipo'][] = ['INGRESO', 'EGRESO'];
  readonly form = this.formBuilder.nonNullable.group({
    tipo: ['EGRESO' as GastoReservado['tipo'], Validators.required],
    categoriaId: this.formBuilder.control<number | null>(null, Validators.required),
    concepto: ['', [Validators.required, Validators.maxLength(200)]],
    periodoId: this.formBuilder.control<number | null>(null, Validators.required),
    estado: ['RESERVADO' as GastoReservado['estado'], Validators.required],
    montoReservado: this.formBuilder.control<number | null>(null, [
      Validators.required,
      Validators.min(0)
    ]),
    montoAplicado: this.formBuilder.control<number | null>(null, [Validators.min(0)]),
    nota: ['', Validators.maxLength(500)]
  });

  readonly formTitle = computed(() => 'Nueva partida presupuestaria');

  readonly cancelDialogTitle = computed(() => 'Cancelar creación');

  readonly cancelDialogMessage = computed(
    () =>
      '¿Deseas cancelar la creación de la partida presupuestaria? Los cambios no guardados se perderán.'
  );

  readonly deleteMessage = computed(() => {
    const gasto = this.gastoPendingDelete();
    return gasto
      ? `¿Desea eliminar la partida presupuestaria "${gasto.concepto}"?`
      : '';
  });

  ngOnInit(): void {
    this.loadCategorias();
    this.loadPeriodos();
    this.loadPeriodosDropdown();
  }

  trackByGastoId = (_: number, gasto: GastoReservado): number => gasto.id;

  private loadCategorias(): void {
    this.categoriasLoading.set(true);
    this.categoriasError.set(null);

    this.categoriaService.list().subscribe({
      next: (categorias) => {
        this.categorias.set(categorias);
        this.categoriasLoading.set(false);
      },
      error: () => {
        this.categoriasError.set('No se pudieron cargar las categorias.');
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

  loadGastos(): void {
    const periodoId = this.selectedPeriodoId();

    if (periodoId === null) {
      this.gastos.set([]);
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.gastoService.listByPeriodo(periodoId).subscribe({
      next: (gastos) => {
        this.gastos.set(gastos);
        const currentlyViewing = this.viewingGasto();
        if (currentlyViewing) {
          const updated = gastos.find((gasto) => gasto.id === currentlyViewing.id) ?? null;
          this.viewingGasto.set(updated);
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
    this.viewingGasto.set(null);

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
      this.gastos.set([]);
      this.loading.set(false);
      this.error.set(null);
      return;
    }

    this.loadGastos();
  }

  onIncludePeriodosCerradosChange(checked: boolean): void {
    this.includePeriodosCerrados.set(checked);
    this.selectedPeriodoId.set(null);
    this.gastos.set([]);
    this.error.set(null);
    this.viewingGasto.set(null);
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

    this.viewingGasto.set(null);
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
    this.viewingGasto.set(null);
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

    const payload: GastoReservadoCreate = {
      tipo: formValue.tipo,
      categoriaId: Number(formValue.categoriaId),
      concepto: formValue.concepto.trim(),
      periodoId: Number(formValue.periodoId),
      estado: 'RESERVADO',
      montoReservado: Number(formValue.montoReservado)
    };

    if (formValue.nota?.trim()) {
      payload.nota = formValue.nota.trim();
    }

    this.saving.set(true);

    this.gastoService.create(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.form.controls.periodoId.enable({ emitEvent: false });
        this.loadGastos();
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

  promptDelete(gasto: GastoReservado): void {
    this.viewingGasto.set(null);
    this.gastoPendingDelete.set(gasto);
  }

  closeDeleteDialog(): void {
    if (this.deleting()) {
      return;
    }

    this.gastoPendingDelete.set(null);
  }

  confirmDeleteGasto(): void {
    const gasto = this.gastoPendingDelete();

    if (!gasto) {
      return;
    }

    this.deleting.set(true);
    this.error.set(null);

    this.loading.set(true);

    this.gastoService.delete(gasto.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.gastoPendingDelete.set(null);
        this.loadGastos();
      },
      error: () => {
        this.error.set('No se pudo eliminar la partida presupuestaria seleccionada.');
        this.deleting.set(false);
        this.gastoPendingDelete.set(null);
        this.loading.set(false);
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
    this.viewingGasto.set(null);
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
          this.gastos.set([]);
          this.loading.set(false);
          this.error.set(null);
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

  formatAccounting(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return '—';
    }

    const absoluteValue = Math.abs(value);
    const formattedAbsolute =
      this.decimalPipe.transform(absoluteValue, '1.0-0') ?? absoluteValue.toString();

    return value < 0 ? `(${formattedAbsolute})` : formattedAbsolute;
  }

  viewGasto(gasto: GastoReservado): void {
    this.viewingGasto.set(gasto);
  }

  closeViewGasto(): void {
    this.viewingGasto.set(null);
  }
}

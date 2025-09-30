import { DatePipe, DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CategoriaFinanciera } from '../../shared/models/categoria-financiera.model';
import {
  GastoReservado,
  GastoReservadoCreate
} from '../../shared/models/gasto-reservado.model';
import { CategoriaFinancieraService } from '../../core/services/categoria-financiera.service';
import { GastoReservadoService } from '../../core/services/gasto-reservado.service';

@Component({
  selector: 'app-gastos-reservados',
  standalone: true,
  imports: [DatePipe, DecimalPipe, NgClass, NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './gastos-reservados.component.html',
  styleUrls: ['./gastos-reservados.component.scss']
})
export class GastosReservadosComponent implements OnInit {
  private readonly gastoService = inject(GastoReservadoService);
  private readonly categoriaService = inject(CategoriaFinancieraService);
  private readonly formBuilder = inject(FormBuilder);

  readonly gastos = signal<GastoReservado[]>([]);
  readonly categorias = signal<CategoriaFinanciera[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly categoriasLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly categoriasError = signal<string | null>(null);
  readonly selectedGasto = signal<GastoReservado | null>(null);
  readonly showForm = signal(false);
  readonly tipoOptions: GastoReservado['tipo'][] = ['INGRESO', 'EGRESO'];
  readonly estadoOptions: GastoReservado['estado'][] = [
    'RESERVADO',
    'APLICADO',
    'CANCELADO'
  ];

  readonly form = this.formBuilder.nonNullable.group({
    tipo: ['EGRESO' as GastoReservado['tipo'], Validators.required],
    categoriaId: this.formBuilder.control<number | null>(null, Validators.required),
    concepto: ['', [Validators.required, Validators.maxLength(200)]],
    periodoFecha: ['', Validators.required],
    fechaVencimiento: this.formBuilder.control<string | null>(null),
    estado: ['RESERVADO' as GastoReservado['estado'], Validators.required],
    montoReservado: this.formBuilder.control<number | null>(null, [
      Validators.required,
      Validators.min(0)
    ]),
    montoAplicado: this.formBuilder.control<number | null>(null, [Validators.min(0)]),
    nota: ['', Validators.maxLength(500)]
  });

  readonly formTitle = computed(() =>
    this.selectedGasto()
      ? `Editar gasto reservado: ${this.selectedGasto()!.concepto}`
      : 'Nuevo gasto reservado'
  );

  ngOnInit(): void {
    this.loadGastos();
    this.loadCategorias();
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
        this.categoriasError.set('No se pudieron cargar las categorías financieras.');
        this.categoriasLoading.set(false);
      }
    });
  }

  loadGastos(): void {
    this.loading.set(true);
    this.error.set(null);

    this.gastoService.list().subscribe({
      next: (gastos) => {
        this.gastos.set(gastos);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los gastos reservados.');
        this.loading.set(false);
      }
    });
  }

  startCreate(): void {
    this.selectedGasto.set(null);
    this.form.reset({
      tipo: 'EGRESO',
      categoriaId: null,
      concepto: '',
      periodoFecha: '',
      fechaVencimiento: null,
      estado: 'RESERVADO',
      montoReservado: null,
      montoAplicado: null,
      nota: ''
    });
    this.showForm.set(true);
  }

  startEdit(gasto: GastoReservado): void {
    this.selectedGasto.set(gasto);
    this.form.reset({
      tipo: gasto.tipo,
      categoriaId: gasto.categoriaId,
      concepto: gasto.concepto,
      periodoFecha: gasto.periodoFecha,
      fechaVencimiento: gasto.fechaVencimiento ?? null,
      estado: gasto.estado,
      montoReservado: gasto.montoReservado,
      montoAplicado: gasto.montoAplicado ?? null,
      nota: gasto.nota ?? ''
    });
    this.showForm.set(true);
  }

  cancelForm(): void {
    this.form.reset();
    this.showForm.set(false);
    this.selectedGasto.set(null);
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
      periodoFecha: formValue.periodoFecha,
      estado: formValue.estado,
      montoReservado: Number(formValue.montoReservado)
    };

    if (formValue.fechaVencimiento) {
      payload.fechaVencimiento = formValue.fechaVencimiento;
    }

    if (formValue.montoAplicado !== null && formValue.montoAplicado !== undefined) {
      payload.montoAplicado = Number(formValue.montoAplicado);
    }

    if (formValue.nota?.trim()) {
      payload.nota = formValue.nota.trim();
    }

    const selected = this.selectedGasto();
    this.saving.set(true);

    const request = selected
      ? this.gastoService.update(selected.id, { ...payload })
      : this.gastoService.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.selectedGasto.set(null);
        this.loadGastos();
      },
      error: (err) => {
        const handled = this.handleFormApiErrors(err);
        if (handled) {
          this.error.set('Revisa los errores marcados en el formulario.');
        } else {
          this.error.set('Ocurrió un error al guardar el gasto reservado.');
        }
        this.saving.set(false);
      }
    });
  }

  deleteGasto(gasto: GastoReservado): void {
    const confirmDelete = window.confirm(
      `¿Desea eliminar el gasto reservado "${gasto.concepto}"?`
    );

    if (!confirmDelete) {
      return;
    }

    this.loading.set(true);

    this.gastoService.delete(gasto.id).subscribe({
      next: () => this.loadGastos(),
      error: () => {
        this.error.set('No se pudo eliminar el gasto reservado seleccionado.');
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
}

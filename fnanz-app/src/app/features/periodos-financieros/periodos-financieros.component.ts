import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  PeriodoFinanciero,
  PeriodoFinancieroCreate
} from '../../shared/models/periodo-financiero.model';
import { PeriodoFinancieroService } from '../../core/services/periodo-financiero.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-periodos-financieros',
  standalone: true,
  imports: [
    ConfirmDialogComponent,
    DatePipe,
    NgClass,
    NgFor,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './periodos-financieros.component.html',
  styleUrls: ['./periodos-financieros.component.scss']
})
export class PeriodosFinancierosComponent implements OnInit {
  private readonly periodoService = inject(PeriodoFinancieroService);
  private readonly formBuilder = inject(FormBuilder);

  readonly periodos = signal<PeriodoFinanciero[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly deleting = signal(false);
  readonly error = signal<string | null>(null);
  readonly selectedPeriodo = signal<PeriodoFinanciero | null>(null);
  readonly periodoPendingDelete = signal<PeriodoFinanciero | null>(null);
  readonly showForm = signal(false);

  readonly form = this.formBuilder.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(150)]],
    fechaInicio: ['', Validators.required],
    fechaFin: ['', Validators.required],
    tipo: [''],
    descripcion: [''],
    cerrado: [false],
  });

  readonly formTitle = computed(() =>
    this.selectedPeriodo()
      ? `Editar periodo financiero: ${this.selectedPeriodo()!.nombre}`
      : 'Nuevo periodo financiero'
  );

  readonly deleteMessage = computed(() => {
    const periodo = this.periodoPendingDelete();
    return periodo
      ? `¿Desea eliminar el periodo financiero "${periodo.nombre}"?`
      : '';
  });

  ngOnInit(): void {
    this.loadPeriodos();
  }

  trackByPeriodoId = (_: number, periodo: PeriodoFinanciero): number => periodo.id;

  loadPeriodos(): void {
    this.loading.set(true);
    this.error.set(null);

    this.periodoService.list().subscribe({
      next: (periodos) => {
        this.periodos.set(periodos);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los periodos financieros.');
        this.loading.set(false);
      }
    });
  }

  startCreate(): void {
    this.selectedPeriodo.set(null);
    this.form.reset({
      nombre: '',
      fechaInicio: '',
      fechaFin: '',
      tipo: '',
      descripcion: '',
      cerrado: false
    });
    this.showForm.set(true);
  }

  startEdit(periodo: PeriodoFinanciero): void {
    this.selectedPeriodo.set(periodo);
    this.form.reset({
      nombre: periodo.nombre,
      fechaInicio: periodo.fechaInicio,
      fechaFin: periodo.fechaFin,
      tipo: periodo.tipo ?? '',
      descripcion: periodo.descripcion ?? '',
      cerrado: periodo.cerrado
    });
    this.showForm.set(true);
  }

  cancelForm(): void {
    this.form.reset();
    this.showForm.set(false);
    this.selectedPeriodo.set(null);
  }

  submitForm(): void {
    this.clearFormErrors();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.error.set(null);
    const formValue = this.form.getRawValue();
    const payload: PeriodoFinancieroCreate = {
      nombre: formValue.nombre.trim(),
      fechaInicio: formValue.fechaInicio,
      fechaFin: formValue.fechaFin,
      cerrado: formValue.cerrado ?? false
    };

    if (formValue.tipo?.trim()) {
      payload.tipo = formValue.tipo.trim();
    }

    if (formValue.descripcion?.trim()) {
      payload.descripcion = formValue.descripcion.trim();
    }

    const selected = this.selectedPeriodo();
    this.saving.set(true);

    const request = selected
      ? this.periodoService.update(selected.id, { ...payload })
      : this.periodoService.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.selectedPeriodo.set(null);
        this.loadPeriodos();
      },
      error: (err) => {
        const handled = this.handleFormApiErrors(err);
        if (handled) {
          this.error.set('Revisa los errores marcados en el formulario.');
        } else {
          this.error.set('Ocurrió un error al guardar el periodo financiero.');
        }
        this.saving.set(false);
      }
    });
  }

  promptDelete(periodo: PeriodoFinanciero): void {
    this.periodoPendingDelete.set(periodo);
  }

  closeDeleteDialog(): void {
    if (this.deleting()) {
      return;
    }

    this.periodoPendingDelete.set(null);
  }

  confirmDeletePeriodo(): void {
    const periodo = this.periodoPendingDelete();

    if (!periodo) {
      return;
    }

    this.deleting.set(true);
    this.error.set(null);

    this.loading.set(true);

    this.periodoService.delete(periodo.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.periodoPendingDelete.set(null);
        this.loadPeriodos();
      },
      error: () => {
        this.error.set('No se pudo eliminar el periodo financiero seleccionado.');
        this.deleting.set(false);
        this.periodoPendingDelete.set(null);
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

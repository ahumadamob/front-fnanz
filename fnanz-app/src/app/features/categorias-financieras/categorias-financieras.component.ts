import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  CategoriaFinanciera,
  CategoriaFinancieraCreate,
} from '../../shared/models/categoria-financiera.model';
import { CategoriaFinancieraService } from '../../core/services/categoria-financiera.service';

@Component({
  selector: 'app-categorias-financieras',
  standalone: true,
  imports: [
    DatePipe,
    NgClass,
    NgFor,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './categorias-financieras.component.html',
  styleUrls: ['./categorias-financieras.component.scss']
})
export class CategoriasFinancierasComponent implements OnInit {
  private readonly categoriaService = inject(CategoriaFinancieraService);
  private readonly formBuilder = inject(FormBuilder);

  readonly categorias = signal<CategoriaFinanciera[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly deleting = signal(false);
  readonly error = signal<string | null>(null);
  readonly selectedCategoria = signal<CategoriaFinanciera | null>(null);
  readonly categoriaPendingDelete = signal<CategoriaFinanciera | null>(null);
  readonly showForm = signal(false);
  readonly tipoOptions: CategoriaFinanciera['tipo'][] = ['INGRESO', 'EGRESO'];

  readonly form = this.formBuilder.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(120)]],
    tipo: ['INGRESO' as CategoriaFinanciera['tipo'], Validators.required],
    activo: [true],
    orden: this.formBuilder.control<number | null>(null),
    descripcion: ['']
  });

  readonly formTitle = computed(() =>
    this.selectedCategoria()
      ? `Editar categoria: ${this.selectedCategoria()!.nombre}`
      : 'Nueva categoria'
  );

  ngOnInit(): void {
    this.loadCategorias();
  }

  trackByCategoriaId = (_: number, categoria: CategoriaFinanciera): number => categoria.id;

  loadCategorias(): void {
    this.loading.set(true);
    this.error.set(null);

    this.categoriaService.list().subscribe({
      next: (categorias) => {
        this.categorias.set(categorias);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las categorias.');
        this.loading.set(false);
      }
    });
  }

  startCreate(): void {
    this.selectedCategoria.set(null);
    this.form.reset({
      nombre: '',
      tipo: 'INGRESO',
      activo: true,
      orden: null,
      descripcion: ''
    });
    this.showForm.set(true);
  }

  startEdit(categoria: CategoriaFinanciera): void {
    this.selectedCategoria.set(categoria);
    this.form.reset({
      nombre: categoria.nombre,
      tipo: categoria.tipo,
      activo: categoria.activo,
      orden: categoria.orden,
      descripcion: categoria.descripcion ?? ''
    });
    this.showForm.set(true);
  }

  cancelForm(): void {
    this.form.reset();
    this.showForm.set(false);
    this.selectedCategoria.set(null);
  }

  submitForm(): void {
    this.clearFormErrors();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.error.set(null);
    const formValue = this.form.getRawValue();
    const payload: CategoriaFinancieraCreate = {
      nombre: formValue.nombre.trim(),
      tipo: formValue.tipo,
      activo: formValue.activo ?? true
    };

    if (formValue.orden !== null && formValue.orden !== undefined) {
      payload.orden = Number(formValue.orden);
    }

    if (formValue.descripcion?.trim()) {
      payload.descripcion = formValue.descripcion.trim();
    }

    const selected = this.selectedCategoria();
    this.saving.set(true);

    const request = selected
      ? this.categoriaService.update(selected.id, { ...payload })
      : this.categoriaService.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.selectedCategoria.set(null);
        this.loadCategorias();
      },
      error: (err) => {
        const handled = this.handleFormApiErrors(err);
        if (handled) {
          this.error.set('Revisa los errores marcados en el formulario.');
        } else {
          this.error.set('Ocurrió un error al guardar la categoria.');
        }
        this.saving.set(false);
      }
    });
  }

  promptDelete(categoria: CategoriaFinanciera): void {
    this.categoriaPendingDelete.set(categoria);
  }

  closeDeleteDialog(): void {
    if (this.deleting()) {
      return;
    }

    this.categoriaPendingDelete.set(null);
  }

  confirmDeleteCategoria(): void {
    const categoria = this.categoriaPendingDelete();

    if (!categoria) {
      return;
    }

    this.deleting.set(true);
    this.error.set(null);

    this.loading.set(true);

    this.categoriaService.delete(categoria.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.categoriaPendingDelete.set(null);
        this.loadCategorias();
      },
      error: () => {
        this.error.set('No se pudo eliminar la categoria seleccionada.');
        this.deleting.set(false);
        this.categoriaPendingDelete.set(null);
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

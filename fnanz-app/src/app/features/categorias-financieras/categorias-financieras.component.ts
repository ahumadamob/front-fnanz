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
  imports: [DatePipe, NgClass, NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './categorias-financieras.component.html',
  styleUrls: ['./categorias-financieras.component.scss']
})
export class CategoriasFinancierasComponent implements OnInit {
  private readonly categoriaService = inject(CategoriaFinancieraService);
  private readonly formBuilder = inject(FormBuilder);

  readonly categorias = signal<CategoriaFinanciera[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly selectedCategoria = signal<CategoriaFinanciera | null>(null);
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
      ? `Editar categoría: ${this.selectedCategoria()!.nombre}`
      : 'Nueva categoría financiera'
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
        this.error.set('No se pudieron cargar las categorías financieras.');
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

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
      error: () => {
        this.error.set('Ocurrió un error al guardar la categoría financiera.');
        this.saving.set(false);
      }
    });
  }

  deleteCategoria(categoria: CategoriaFinanciera): void {
    const confirmDelete = window.confirm(
      `¿Desea eliminar la categoría financiera "${categoria.nombre}"?`
    );

    if (!confirmDelete) {
      return;
    }

    this.loading.set(true);

    this.categoriaService.delete(categoria.id).subscribe({
      next: () => this.loadCategorias(),
      error: () => {
        this.error.set('No se pudo eliminar la categoría financiera seleccionada.');
        this.loading.set(false);
      }
    });
  }
}

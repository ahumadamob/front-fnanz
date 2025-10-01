import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  @Input({ required: true }) open = false;
  @Input({ required: true }) title = '';
  @Input({ required: true }) message = '';
  @Input() confirmLabel = 'Confirmar';
  @Input() cancelLabel = 'Cancelar';
  @Input() busyLabel = 'Procesando...';
  @Input() busy = false;
  @Input() confirmDestructive = false;

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent): void {
    if (!this.open || this.busy) {
      return;
    }

    event.preventDefault();
    this.cancel.emit();
  }

  handleBackdropClick(event: MouseEvent): void {
    if (this.busy) {
      return;
    }

    if (event.target instanceof HTMLElement && event.target.classList.contains('modal')) {
      this.cancel.emit();
    }
  }

  onCancel(): void {
    if (this.busy) {
      return;
    }

    this.cancel.emit();
  }

  onConfirm(): void {
    if (this.busy) {
      return;
    }

    this.confirm.emit();
  }

  get confirmButtonClass(): string {
    return this.confirmDestructive ? 'danger-button' : 'primary-button';
  }
}

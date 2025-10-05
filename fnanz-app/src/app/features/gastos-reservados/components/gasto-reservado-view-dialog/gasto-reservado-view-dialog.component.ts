import { DatePipe, DecimalPipe, NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output, inject } from '@angular/core';

import { GastoReservado } from '../../../../shared/models/gasto-reservado.model';

@Component({
  selector: 'app-gasto-reservado-view-dialog',
  standalone: true,
  imports: [DatePipe, NgClass, NgIf],
  templateUrl: './gasto-reservado-view-dialog.component.html',
  styleUrls: ['./gasto-reservado-view-dialog.component.scss'],
  providers: [DecimalPipe],
})
export class GastoReservadoViewDialogComponent {
  private readonly decimalPipe = inject(DecimalPipe);

  @Input({ required: true }) open = false;
  @Input({ required: true }) gasto: GastoReservado | null = null;

  @Output() close = new EventEmitter<void>();

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent): void {
    if (!this.open) {
      return;
    }

    event.preventDefault();
    this.close.emit();
  }

  handleBackdropClick(event: MouseEvent): void {
    if (event.target instanceof HTMLElement && event.target.classList.contains('modal')) {
      this.close.emit();
    }
  }

  onClose(): void {
    this.close.emit();
  }

  getMontoReservado(): string {
    return this.formatAmount(this.gasto?.montoReservado);
  }

  getMontoAplicado(): string {
    return this.formatAmount(this.gasto?.montoAplicado);
  }

  private formatAmount(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return '—';
    }

    const absoluteValue = Math.abs(value);
    const formattedAbsolute =
      this.decimalPipe.transform(absoluteValue, '1.0-0') ?? absoluteValue.toString();

    return value < 0 ? `(${formattedAbsolute})` : formattedAbsolute;
  }
}

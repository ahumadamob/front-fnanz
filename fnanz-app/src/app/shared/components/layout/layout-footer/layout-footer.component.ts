import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'fn-layout-footer',
  standalone: true,
  templateUrl: './layout-footer.component.html',
  styleUrls: ['./layout-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutFooterComponent {
  @Input({ required: true }) currentYear!: number;
}

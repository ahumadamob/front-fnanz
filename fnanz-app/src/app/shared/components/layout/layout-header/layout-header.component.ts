import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'fn-layout-header',
  standalone: true,
  templateUrl: './layout-header.component.html',
  styleUrls: ['./layout-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutHeaderComponent {
  @Input() pageTitle = 'Panel administrativo';
}

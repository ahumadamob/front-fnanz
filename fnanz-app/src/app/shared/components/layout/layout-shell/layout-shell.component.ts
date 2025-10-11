import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavigationLink } from '../../../models/navigation-link.model';
import { LayoutSidebarComponent } from '../layout-sidebar/layout-sidebar.component';
import { LayoutHeaderComponent } from '../layout-header/layout-header.component';
import { LayoutFooterComponent } from '../layout-footer/layout-footer.component';

@Component({
  selector: 'fn-layout-shell',
  standalone: true,
  imports: [LayoutSidebarComponent, LayoutHeaderComponent, LayoutFooterComponent, RouterOutlet],
  templateUrl: './layout-shell.component.html',
  styleUrls: ['./layout-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutShellComponent {
  @Input({ required: true }) envLabel!: string;
  @Input({ required: true }) currentYear!: number;
  @Input({ required: true }) links!: readonly NavigationLink[];
  @Input() pageTitle = '';
}

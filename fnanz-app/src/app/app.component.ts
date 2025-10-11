import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { EnvironmentService } from '@core/services/environment.service';
import { LayoutShellComponent } from '@shared/components/layout/layout-shell/layout-shell.component';
import type { NavigationLink } from '@shared/models/navigation-link.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutShellComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private readonly environmentService = inject(EnvironmentService);

  readonly envLabel = signal(this.environmentService.environmentLabel);
  readonly currentYear = new Date().getFullYear();
  readonly pageTitle = 'Panel administrativo';

  readonly navigationLinks: readonly NavigationLink[] = [
    { label: 'Dashboard', route: '/', icon: 'dashboard', exact: true },
    { label: 'Categorias', route: '/categorias', icon: 'categories' },
    { label: 'Periodos', route: '/periodos', icon: 'periods' },
    { label: 'Presupuestos', route: '/presupuestos', icon: 'budgets' }
  ];
}

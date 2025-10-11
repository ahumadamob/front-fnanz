import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  ButtonModule,
  DropdownModule,
  HeaderModule,
  NavbarModule,
  SidebarModule,
  TooltipModule
} from '@coreui/angular';

import { EnvironmentService } from './core/services/environment.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ButtonModule,
    DropdownModule,
    HeaderModule,
    NavbarModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    SidebarModule,
    TooltipModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private readonly environmentService = inject(EnvironmentService);

  readonly envLabel = signal(this.environmentService.environmentLabel);
  readonly currentYear = new Date().getFullYear();
  readonly sidebarVisible = signal(true);
  readonly sidebarCollapsed = signal(false);

  constructor() {
    effect(() => {
      if (!this.sidebarVisible() && this.sidebarCollapsed()) {
        this.sidebarCollapsed.set(false);
      }
    });
  }

  toggleSidebarVisible(): void {
    this.sidebarVisible.update((value) => !value);
  }

  toggleSidebarCollapsed(): void {
    this.sidebarCollapsed.update((value) => !value);
  }

  onSidebarVisibleChange(visible: boolean): void {
    this.sidebarVisible.set(visible);
  }

  closeSidebarOnMobile(): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (window.matchMedia('(max-width: 960px)').matches) {
      this.sidebarVisible.set(false);
    }
  }
}

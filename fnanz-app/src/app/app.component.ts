import { CommonModule, NgClass } from '@angular/common';
import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { EnvironmentService } from './core/services/environment.service';

interface NavItem {
  label: string;
  route: string;
  iconPaths: string[];
  exact?: boolean;
  badge?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NgClass, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private readonly environmentService = inject(EnvironmentService);

  readonly envLabel = signal(this.environmentService.environmentLabel);
  readonly currentYear = new Date().getFullYear();
  readonly isSidebarCollapsed = signal(this.resolveInitialSidebarState());

  readonly navItems: NavItem[] = [
    {
      label: 'Dashboard',
      route: '/',
      iconPaths: ['M3 11l9-8 9 8', 'M5 13v7h4v-4h6v4h4v-7'],
      exact: true
    },
    {
      label: 'Categorías',
      route: '/categorias',
      iconPaths: ['M4 4h6v6H4z', 'M14 4h6v6h-6z', 'M4 14h6v6H4z', 'M14 14h6v6h-6z']
    },
    {
      label: 'Periodos',
      route: '/periodos',
      iconPaths: ['M3 4h18v18H3z', 'M16 2v6', 'M8 2v6', 'M3 10h18']
    },
    {
      label: 'Presupuestos',
      route: '/presupuestos',
      iconPaths: ['M12 1v4', 'M7 5h10l4 6-4 6H7L3 11z', 'M12 9v4', 'M10 13h4']
    }
  ];

  toggleSidebar(): void {
    this.isSidebarCollapsed.update((value) => !value);
  }

  closeSidebarOnMobile(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const isMobile = window.matchMedia('(max-width: 960px)').matches;
    if (isMobile) {
      this.isSidebarCollapsed.set(true);
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const isDesktop = window.matchMedia('(min-width: 1200px)').matches;
    if (isDesktop) {
      this.isSidebarCollapsed.set(false);
    }
  }

  private resolveInitialSidebarState(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.matchMedia('(max-width: 960px)').matches;
  }
}

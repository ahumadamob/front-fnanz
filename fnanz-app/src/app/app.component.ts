import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  ButtonModule,
  DropdownModule,
  FooterModule,
  HeaderModule,
  IconModule,
  NavbarModule,
  NavModule,
  SidebarModule,
  SidebarService,
  TooltipModule
} from '@coreui/angular';

import { EnvironmentService } from './core/services/environment.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ButtonModule,
    DropdownModule,
    FooterModule,
    HeaderModule,
    IconModule,
    NavbarModule,
    NavModule,
    NgFor,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    SidebarModule,
    TooltipModule
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  private readonly environmentService = inject(EnvironmentService);
  private readonly coreSidebar = inject(SidebarService);

  readonly envLabel = signal(this.environmentService.environmentLabel);
  readonly currentYear = new Date().getFullYear();

  readonly navigation: ReadonlyArray<{
    label: string;
    route: string;
    icon: 'home' | 'categories' | 'calendar' | 'budget';
    exact?: boolean;
    activeOptions?: { exact: boolean };
  }> = [
    {
      label: 'Dashboard',
      route: '/',
      exact: true,
      icon: 'home',
      activeOptions: { exact: true }
    },
    {
      label: 'Categorias',
      route: '/categorias',
      icon: 'categories'
    },
    {
      label: 'Periodos',
      route: '/periodos',
      icon: 'calendar'
    },
    {
      label: 'Presupuestos',
      route: '/presupuestos',
      icon: 'budget'
    }
  ];

  toggleSidebar(): void {
    if (typeof this.coreSidebar.toggle === 'function') {
      this.coreSidebar.toggle();
    }
  }
}

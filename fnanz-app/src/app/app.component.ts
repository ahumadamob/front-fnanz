import { NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, NgTemplateOutlet } from '@angular/common';
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

type IconKey =
  | 'dashboard'
  | 'categories'
  | 'calendar'
  | 'budget'
  | 'layers'
  | 'widgets'
  | 'docs'
  | 'chart'
  | 'bell'
  | 'bullet';

type AppNavBadge = Readonly<{ text: string; color: string }>;

type AppNavLink = Readonly<{
  kind: 'link';
  id: string;
  label: string;
  icon?: IconKey;
  route?: string;
  href?: string;
  target?: '_blank' | '_self';
  badge?: AppNavBadge;
  activeOptions?: { exact: boolean };
}>;

type AppNavTitle = Readonly<{ kind: 'title'; id: string; label: string }>;

type AppNavGroup = Readonly<{
  kind: 'group';
  id: string;
  label: string;
  icon?: IconKey;
  initiallyOpen?: boolean;
  children: ReadonlyArray<AppNavLink>;
}>;

type AppNavItem = AppNavLink | AppNavTitle | AppNavGroup;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgClass,
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
    NgTemplateOutlet,
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
  readonly defaultActiveOptions = { exact: false } as const;

  readonly navigation: ReadonlyArray<AppNavItem> = [
    {
      kind: 'link',
      id: 'dashboard',
      label: 'Dashboard',
      route: '/',
      icon: 'dashboard',
      activeOptions: { exact: true },
      badge: { text: 'NEW', color: 'info' }
    },
    { kind: 'title', id: 'gestion-title', label: 'Gestión' },
    {
      kind: 'group',
      id: 'catalogos',
      label: 'Catálogos',
      icon: 'layers',
      initiallyOpen: true,
      children: [
        {
          kind: 'link',
          id: 'categorias',
          label: 'Categorías',
          route: '/categorias',
          icon: 'bullet'
        },
        {
          kind: 'link',
          id: 'presupuestos',
          label: 'Presupuestos',
          route: '/presupuestos',
          icon: 'bullet'
        }
      ]
    },
    {
      kind: 'group',
      id: 'planificacion',
      label: 'Planificación',
      icon: 'calendar',
      children: [
        {
          kind: 'link',
          id: 'periodos',
          label: 'Periodos',
          route: '/periodos',
          icon: 'bullet'
        }
      ]
    },
    { kind: 'title', id: 'extras-title', label: 'Extras' },
    {
      kind: 'link',
      id: 'widgets',
      label: 'Widgets',
      href: 'https://coreui.io/angular/demo/5.0/widgets',
      target: '_blank',
      icon: 'widgets'
    },
    {
      kind: 'link',
      id: 'charts',
      label: 'Charts',
      href: 'https://coreui.io/angular/demo/5.0/charts',
      target: '_blank',
      icon: 'chart'
    },
    {
      kind: 'link',
      id: 'notifications',
      label: 'Notifications',
      href: 'https://coreui.io/angular/demo/5.0/notifications',
      target: '_blank',
      icon: 'bell'
    },
    {
      kind: 'link',
      id: 'docs',
      label: 'Documentación',
      href: 'https://coreui.io/angular/docs/',
      target: '_blank',
      icon: 'docs',
      badge: { text: 'DOCS', color: 'primary' }
    }
  ];

  readonly openGroups = signal(
    this.navigation.reduce((set, item) => {
      if (item.kind === 'group' && item.initiallyOpen) {
        set.add(item.id);
      }
      return set;
    }, new Set<string>())
  );

  toggleSidebar(): void {
    if (typeof this.coreSidebar.toggle === 'function') {
      this.coreSidebar.toggle();
    }
  }

  isGroupOpen(id: string): boolean {
    return this.openGroups().has(id);
  }

  toggleGroup(id: string): void {
    this.openGroups.update((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  onGroupToggle(event: Event, id: string): void {
    event.preventDefault();
    this.toggleGroup(id);
  }
}

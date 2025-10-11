import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  effect,
  inject,
  signal
} from '@angular/core';
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
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    SidebarModule,
    HeaderModule,
    NavbarModule,
    ButtonModule,
    DropdownModule,
    TooltipModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private readonly environmentService = inject(EnvironmentService);
  private readonly destroyRef = inject(DestroyRef);
  readonly envLabel = signal(this.environmentService.environmentLabel);
  readonly currentYear = new Date().getFullYear();
  readonly sidebarVisible = signal(true);
  readonly sidebarCollapsed = signal(false);
  readonly quickActionsOpen = signal(false);
  readonly isMobile = signal(false);

  constructor() {
    this.evaluateViewport();

    if (typeof window !== 'undefined') {
      const resizeListener = () => this.evaluateViewport();
      window.addEventListener('resize', resizeListener);
      this.destroyRef.onDestroy(() => window.removeEventListener('resize', resizeListener));
    }

    effect(() => {
      if (!this.sidebarVisible() && this.sidebarCollapsed()) {
        this.sidebarCollapsed.set(false);
      }
    });

    effect(() => {
      if (!this.isMobile() && !this.sidebarVisible()) {
        this.sidebarVisible.set(true);
      }
    });
  }

  toggleSidebarVisible(): void {
    this.sidebarVisible.update((value) => !value);
    this.quickActionsOpen.set(false);
  }

  toggleSidebarCollapsed(): void {
    this.sidebarCollapsed.update((value) => !value);
  }

  closeSidebarOnMobile(): void {
    if (this.isMobile()) {
      this.sidebarVisible.set(false);
    }
  }

  onDropdownVisibleChange(visible: boolean): void {
    this.quickActionsOpen.set(visible);
  }

  onQuickActionSelected(): void {
    this.closeSidebarOnMobile();
    this.quickActionsOpen.set(false);
  }

  private evaluateViewport(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const isMobile = window.matchMedia('(max-width: 960px)').matches;
    this.isMobile.set(isMobile);

    if (!isMobile) {
      this.sidebarVisible.set(true);
    }
  }
}

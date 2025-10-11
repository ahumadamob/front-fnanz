import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  HostListener,
  effect,
  inject,
  signal
} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { EnvironmentService } from './core/services/environment.service';
import { TooltipDirective } from './shared/directives/tooltip.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, TooltipDirective],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
    this.closeQuickActions();
  }

  toggleSidebarCollapsed(): void {
    this.sidebarCollapsed.update((value) => !value);
  }

  closeSidebarOnMobile(): void {
    if (this.isMobile()) {
      this.sidebarVisible.set(false);
    }
    this.closeQuickActions();
  }

  toggleQuickActions(event: MouseEvent): void {
    event.stopPropagation();
    this.quickActionsOpen.update((value) => !value);
  }

  closeQuickActions(): void {
    if (this.quickActionsOpen()) {
      this.quickActionsOpen.set(false);
    }
  }

  onQuickActionSelected(): void {
    this.closeQuickActions();
    this.closeSidebarOnMobile();
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeQuickActions();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeQuickActions();
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

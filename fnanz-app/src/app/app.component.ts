import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  ViewChild,
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
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    TooltipDirective
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private readonly environmentService = inject(EnvironmentService);
  private readonly destroyRef = inject(DestroyRef);
  @ViewChild('quickActionsDropdown') quickActionsDropdown?: ElementRef<HTMLElement>;
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

    if (typeof document !== 'undefined') {
      const handleDocumentClick = (event: MouseEvent) => {
        if (!this.quickActionsOpen()) {
          return;
        }

        const dropdown = this.quickActionsDropdown?.nativeElement;
        if (!dropdown || dropdown.contains(event.target as Node)) {
          return;
        }

        this.quickActionsOpen.set(false);
      };

      document.addEventListener('click', handleDocumentClick);
      this.destroyRef.onDestroy(() => document.removeEventListener('click', handleDocumentClick));
    }
  }

  toggleSidebarVisible(): void {
    this.sidebarVisible.update((value) => !value);
    this.quickActionsOpen.set(false);
  }

  toggleSidebarCollapsed(): void {
    this.sidebarCollapsed.update((value) => !value);
  }

  toggleQuickActions(): void {
    this.quickActionsOpen.update((value) => !value);
  }

  closeQuickActions(): void {
    this.quickActionsOpen.set(false);
  }

  onDropdownFocusOut(event: FocusEvent): void {
    if (!this.quickActionsOpen()) {
      return;
    }

    const dropdown = this.quickActionsDropdown?.nativeElement;
    const nextTarget = event.relatedTarget as Node | null;

    if (!dropdown || (nextTarget && dropdown.contains(nextTarget))) {
      return;
    }

    this.closeQuickActions();
  }

  closeSidebarOnMobile(): void {
    if (this.isMobile()) {
      this.sidebarVisible.set(false);
    }
  }

  onQuickActionSelected(): void {
    this.closeSidebarOnMobile();
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

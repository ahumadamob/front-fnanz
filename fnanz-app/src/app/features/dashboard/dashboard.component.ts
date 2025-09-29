import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, inject, signal } from '@angular/core';

import { SystemHealth } from '../../shared/models/system-health.model';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgClass, NgFor, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private readonly dashboardService = inject(DashboardService);

  readonly lastRefresh = signal(new Date());
  readonly healthSnapshot$ = this.dashboardService.loadSystemHealth();

  refresh(): void {
    this.dashboardService.refresh();
    this.lastRefresh.set(new Date());
  }

  resolveStatusClass(status: SystemHealth['status']): string {
    switch (status) {
      case 'UP':
        return 'status-pill status-pill--up';
      case 'DEGRADED':
        return 'status-pill status-pill--degraded';
      default:
        return 'status-pill status-pill--down';
    }
  }
}

import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { EnvironmentService } from './core/services/environment.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private readonly environmentService = inject(EnvironmentService);

  readonly envLabel = signal(this.environmentService.environmentLabel);
  readonly currentYear = new Date().getFullYear();
}

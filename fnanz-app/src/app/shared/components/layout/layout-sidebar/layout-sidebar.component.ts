import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgFor, NgSwitch, NgSwitchCase } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { NavigationLink } from '../../../models/navigation-link.model';

@Component({
  selector: 'fn-layout-sidebar',
  standalone: true,
  imports: [NgFor, NgSwitch, NgSwitchCase, RouterLink, RouterLinkActive],
  templateUrl: './layout-sidebar.component.html',
  styleUrls: ['./layout-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutSidebarComponent {
  @Input({ required: true }) envLabel!: string;
  @Input({ required: true }) links!: readonly NavigationLink[];
  @Input() brand = 'Fnanz Plataforma';

  readonly exactMatchOptions = { exact: true } as const;
  readonly partialMatchOptions = { exact: false } as const;
}

import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  Directive,
  effect,
  HostBinding,
  HostListener,
  inject,
  Injectable,
  Input,
  NgModule,
  Optional,
  signal
} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  #visible = signal(true);

  readonly visible = this.#visible.asReadonly();

  toggle(): void {
    this.#visible.update((value) => !value);
  }

  show(): void {
    this.#visible.set(true);
  }

  hide(): void {
    this.#visible.set(false);
  }

  isVisible(): boolean {
    return this.#visible();
  }
}

@Component({
  selector: 'c-app',
  standalone: false,
  template: '<ng-content></ng-content>',
  host: {
    class: 'c-app d-flex'
  }
})
export class CAppComponent {}

@Component({
  selector: 'c-sidebar',
  standalone: false,
  template: '<ng-content></ng-content>',
  host: {
    class: 'sidebar d-flex flex-column c-sidebar'
  }
})
export class CSidebarComponent {
  private readonly sidebar = inject(SidebarService, { optional: true });
  private readonly destroyRef = inject(DestroyRef);

  @Input() colorScheme: 'light' | 'dark' | string = 'dark';

  @HostBinding('class.sidebar-dark') get darkScheme(): boolean {
    return this.colorScheme === 'dark';
  }

  @HostBinding('class.sidebar-light') get lightScheme(): boolean {
    return this.colorScheme === 'light';
  }

  @HostBinding('class.sidebar-collapsed') collapsed = false;
  @HostBinding('class.show') show = true;
  @HostBinding('attr.aria-hidden') ariaHidden: 'true' | null = null;
  @HostBinding('attr.hidden') hidden: '' | null = null;

  constructor() {
    const sidebar = this.sidebar;
    if (!sidebar) {
      return;
    }

    const effectRef = effect(() => {
      const visible = sidebar.visible();
      this.collapsed = !visible;
      this.show = visible;
      this.ariaHidden = visible ? null : 'true';
      this.hidden = visible ? null : '';
    });

    this.destroyRef.onDestroy(() => effectRef.destroy());
  }
}

@Component({
  selector: 'c-sidebar-header',
  standalone: false,
  template: '<ng-content></ng-content>',
  host: {
    class: 'sidebar-header'
  }
})
export class CSidebarHeaderComponent {}

@Component({
  selector: 'c-sidebar-brand',
  standalone: false,
  template: '<ng-content></ng-content>',
  host: {
    class: 'c-sidebar-brand d-flex align-items-center gap-2 text-decoration-none'
  }
})
export class CSidebarBrandComponent {}

@Component({
  selector: 'c-sidebar-nav',
  standalone: false,
  template: '<ng-content></ng-content>',
  host: {
    class: 'c-sidebar-nav flex-grow-1 overflow-auto'
  }
})
export class CSidebarNavComponent {}

@Component({
  selector: 'c-sidebar-nav-title',
  standalone: false,
  template: '<ng-content></ng-content>',
  host: {
    class: 'nav-title'
  }
})
export class CSidebarNavTitleComponent {}

@Component({
  selector: 'c-sidebar-nav-link',
  standalone: false,
  template: '<ng-content></ng-content>',
  host: {
    class: 'nav-item'
  }
})
export class CSidebarNavLinkComponent {}

@Component({
  selector: 'c-sidebar-nav-link-content',
  standalone: false,
  template: '<ng-content></ng-content>',
  host: {
    class: 'nav-link-content flex-grow-1'
  }
})
export class CSidebarNavLinkContentComponent {}

@Component({
  selector: 'c-sidebar-nav-group',
  standalone: false,
  template: '<ng-content></ng-content>',
  host: {
    class: 'nav-group'
  }
})
export class CSidebarNavGroupComponent {
  @HostBinding('class.show')
  open = false;

  @Input()
  set expanded(value: boolean | string) {
    this.open = value === '' ? true : !!value;
  }
}

@Component({
  selector: 'c-sidebar-footer',
  standalone: false,
  template: '<ng-content></ng-content>',
  host: {
    class: 'sidebar-footer'
  }
})
export class CSidebarFooterComponent {}

@Component({
  selector: 'c-header',
  standalone: false,
  template: '<ng-content></ng-content>',
  host: {
    class: 'c-header w-100 d-flex align-items-center'
  }
})
export class CHeaderComponent {}

@Component({
  selector: 'c-header-nav',
  standalone: false,
  template: '<ng-content></ng-content>',
  host: {
    class: 'c-header-nav d-flex align-items-center'
  }
})
export class CHeaderNavComponent {}

@Component({
  selector: 'c-footer',
  standalone: false,
  template: '<ng-content></ng-content>',
  host: {
    class: 'c-footer w-100'
  }
})
export class CFooterComponent {}

@Component({
  selector: 'c-nav',
  standalone: false,
  template: '<ng-content></ng-content>',
  host: {
    class: 'nav'
  }
})
export class CNavComponent {}

@Component({
  selector: 'c-nav-item',
  standalone: false,
  template: '<ng-content></ng-content>',
  host: {
    class: 'nav-item'
  }
})
export class CNavItemComponent {}

@Directive({
  selector: '[cNavLink]',
  standalone: false
})
export class CNavLinkDirective {
  @HostBinding('class.nav-link') readonly baseClass = true;
  @HostBinding('class.active') active = false;

  @Input() set cNavLinkActive(isActive: boolean) {
    this.active = isActive;
  }
}

@Directive({
  selector: '[cButton]',
  standalone: false
})
export class CButtonDirective {
  @HostBinding('class.btn') readonly baseClass = true;

  #color: string | null = null;

  @Input()
  set color(value: string | null) {
    this.#color = value;
  }

  @HostBinding('class.btn-ghost')
  get ghostClass(): boolean {
    return this.#color === 'ghost';
  }
}

@Component({
  selector: 'c-dropdown',
  template: '<ng-content></ng-content>',
  host: {
    class: 'dropdown position-relative d-inline-flex'
  }
})
export class CDropdownComponent {
  @Input() alignment: 'start' | 'end' | 'center' | string = 'start';

  @HostBinding('class.show')
  open = false;

  toggle(): void {
    this.open = !this.open;
  }

  close(): void {
    this.open = false;
  }
}

@Directive({
  selector: '[cDropdownToggle]',
  standalone: false
})
export class CDropdownToggleDirective {
  constructor(@Optional() private readonly dropdown: CDropdownComponent | null) {}

  @HostBinding('attr.aria-haspopup') readonly ariaHaspopup = 'menu';

  @HostBinding('attr.aria-expanded')
  get ariaExpanded(): boolean {
    return !!this.dropdown?.open;
  }

  @HostListener('click')
  toggle(): void {
    this.dropdown?.toggle();
  }
}

@Directive({
  selector: '[cDropdownMenu]',
  standalone: false
})
export class CDropdownMenuDirective {
  constructor(@Optional() private readonly dropdown: CDropdownComponent | null) {}

  @HostBinding('class.dropdown-menu')
  readonly baseClass = true;

  @HostBinding('class.show')
  get showClass(): boolean {
    return !!this.dropdown?.open;
  }
}

@Directive({
  selector: '[cDropdownItem]',
  standalone: false
})
export class CDropdownItemDirective {
  @HostBinding('class.dropdown-item')
  readonly baseClass = true;
}

@Directive({
  selector: '[cTooltip]',
  standalone: false
})
export class CTooltipDirective {
  @Input('cTooltip')
  tooltip: string | null = null;

  @HostBinding('attr.title')
  get title(): string | null {
    return this.tooltip;
  }

  @HostBinding('attr.data-c-tooltip')
  get dataTooltip(): string | null {
    return this.tooltip;
  }
}

@NgModule({
  declarations: [CButtonDirective],
  exports: [CButtonDirective]
})
export class ButtonModule {}

@NgModule({
  declarations: [CDropdownComponent, CDropdownToggleDirective, CDropdownMenuDirective, CDropdownItemDirective],
  exports: [CDropdownComponent, CDropdownToggleDirective, CDropdownMenuDirective, CDropdownItemDirective]
})
export class DropdownModule {}

@NgModule({
  declarations: [CFooterComponent],
  exports: [CFooterComponent]
})
export class FooterModule {}

@NgModule({
  declarations: [CHeaderComponent, CHeaderNavComponent],
  exports: [CHeaderComponent, CHeaderNavComponent]
})
export class HeaderModule {}

@NgModule({
  declarations: [],
  exports: []
})
export class IconModule {}

@NgModule({
  declarations: [],
  exports: []
})
export class NavbarModule {}

@NgModule({
  declarations: [CNavComponent, CNavItemComponent, CNavLinkDirective],
  exports: [CNavComponent, CNavItemComponent, CNavLinkDirective]
})
export class NavModule {}

@NgModule({
  imports: [CommonModule],
  declarations: [
    CAppComponent,
    CSidebarComponent,
    CSidebarHeaderComponent,
    CSidebarBrandComponent,
    CSidebarNavComponent,
    CSidebarNavTitleComponent,
    CSidebarNavLinkComponent,
    CSidebarNavLinkContentComponent,
    CSidebarNavGroupComponent,
    CSidebarFooterComponent
  ],
  exports: [
    CAppComponent,
    CSidebarComponent,
    CSidebarHeaderComponent,
    CSidebarBrandComponent,
    CSidebarNavComponent,
    CSidebarNavTitleComponent,
    CSidebarNavLinkComponent,
    CSidebarNavLinkContentComponent,
    CSidebarNavGroupComponent,
    CSidebarFooterComponent
  ]
})
export class SidebarModule {}

@NgModule({
  declarations: [CTooltipDirective],
  exports: [CTooltipDirective]
})
export class TooltipModule {}

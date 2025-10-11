import { Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[fnTooltip]',
  standalone: true
})
export class TooltipDirective implements OnChanges, OnDestroy, OnInit {
  @Input('fnTooltip') text = '';

  constructor(private readonly host: ElementRef<HTMLElement>, private readonly renderer: Renderer2) {}

  ngOnInit(): void {
    this.updateTooltip();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['text']) {
      this.updateTooltip();
    }
  }

  ngOnDestroy(): void {
    this.renderer.removeAttribute(this.host.nativeElement, 'data-tooltip');
    this.renderer.removeAttribute(this.host.nativeElement, 'aria-label');
  }

  private updateTooltip(): void {
    const content = this.text?.trim();

    if (!content) {
      this.renderer.removeAttribute(this.host.nativeElement, 'data-tooltip');
      this.renderer.removeAttribute(this.host.nativeElement, 'aria-label');
      return;
    }

    this.renderer.setAttribute(this.host.nativeElement, 'data-tooltip', content);
    if (!this.host.nativeElement.getAttribute('aria-label')) {
      this.renderer.setAttribute(this.host.nativeElement, 'aria-label', content);
    }
  }
}

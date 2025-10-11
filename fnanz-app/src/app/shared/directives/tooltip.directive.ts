import { Directive, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[cTooltip]',
  standalone: true
})
export class TooltipDirective implements OnInit, OnChanges {
  @Input('cTooltip') tooltip: string | null = null;

  constructor(private readonly elementRef: ElementRef<HTMLElement>, private readonly renderer: Renderer2) {}

  ngOnInit(): void {
    this.applyTooltip();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tooltip']) {
      this.applyTooltip();
    }
  }

  private applyTooltip(): void {
    const value = this.tooltip ?? '';

    if (value) {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'title', value);
      this.renderer.setAttribute(this.elementRef.nativeElement, 'data-tooltip', value);
    } else {
      this.renderer.removeAttribute(this.elementRef.nativeElement, 'title');
      this.renderer.removeAttribute(this.elementRef.nativeElement, 'data-tooltip');
    }
  }
}

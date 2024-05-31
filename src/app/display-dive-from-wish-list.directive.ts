import { Directive, Input, Renderer2, ElementRef, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appDisplayDiveFromWishList]'
})
export class DisplayDiveFromWishListDirective {

  @Input('appDisplayDiveFromWishList') customProperty: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customProperty']) {
      this.updateDisplay();
    }
  }

  private updateDisplay(): void {
    if (this.customProperty) {
      this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'display');
    }
  }

}

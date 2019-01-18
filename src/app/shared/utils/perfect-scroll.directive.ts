import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

import PerfectScrollbar from 'perfect-scrollbar';

@Directive({
    selector: '[appPerfectScroll]'
})
export class PerfectScrollDirective implements OnInit {

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    ngOnInit() {
        this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
        this.renderer.setStyle(this.el.nativeElement, 'min-height', '65px');
        const ps = new PerfectScrollbar(this.el.nativeElement);
    }
}

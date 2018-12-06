import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

import PerfectScrollbar from 'perfect-scrollbar';

@Directive({
    selector: '[perfectScroll]'
})
export class PerfectScrollDirective implements OnInit {

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    ngOnInit() {
        this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
        const ps = new PerfectScrollbar(this.el.nativeElement);
    }
}

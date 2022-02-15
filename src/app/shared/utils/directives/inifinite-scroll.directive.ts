import { Directive, ElementRef, OnInit, Renderer2, Output, EventEmitter } from '@angular/core';

@Directive({
    selector: '[infiniteScroll]'
})
export class InfiniteScrollDirective implements OnInit {
    @Output() scrolled = new EventEmitter();

    constructor(private el: ElementRef) { }

    ngOnInit() {
        const nativeElement = this.el.nativeElement;

        nativeElement.addEventListener('scroll', () => {
            const point = nativeElement.scrollHeight * 0.9;
            if (nativeElement.offsetHeight + nativeElement.scrollTop >= point) {
                this.scrolled.emit();
            }
        });
    }
}

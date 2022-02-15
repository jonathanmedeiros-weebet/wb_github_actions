import {Directive, Input} from '@angular/core';

@Directive({
    selector: 'img[size]',
    host: {
        '(error)': 'updateUrl()',
        '[src]': 'src'
    }
})
export class DefaultImageDirective {
    @Input() src: string;
    @Input() size: string;

    updateUrl() {
        this.src = `https://cdn.wee.bet/img/times/${this.size}/default.png`;
    }
}

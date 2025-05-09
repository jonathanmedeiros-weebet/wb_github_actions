import { Component, Input } from '@angular/core';

@Component({
    selector: 'icon-verified-user',
    template: `
        <svg xmlns="http://www.w3.org/2000/svg" [attr.width]="size" [attr.height]="size" viewBox="0 0 27 27" fill="none">
            <path d="M24.3334 6.99992C24.3334 5.80825 23.3584 4.83325 22.1667 4.83325H4.83341C3.64175 4.83325 2.66675 5.80825 2.66675 6.99992V19.9999C2.66675 21.1916 3.64175 22.1666 4.83341 22.1666H22.1667C23.3584 22.1666 24.3334 21.1916 24.3334 19.9999V6.99992ZM22.1667 6.99992L13.5001 12.4166L4.83341 6.99992H22.1667ZM22.1667 19.9999H4.83341V9.16659L13.5001 14.5833L22.1667 9.16659V19.9999Z" [attr.fill]="color"/>
        </svg>
    `
})
export class IconMailComponent {
    @Input() size: number = 18;
    @Input() color: string = 'var(--highlight)';
}
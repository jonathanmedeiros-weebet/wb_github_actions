import { Component, Input } from '@angular/core';

@Component({
    selector: 'icon-signal-phone',
    template: `
        <svg xmlns="http://www.w3.org/2000/svg" [attr.width]="size" [attr.height]="size" viewBox="0 0 20 20" fill="none">
            <path d="M0.339844 19.75H3.58984V16.5H0.339844M5.75651 19.75H9.00651V12.1667H5.75651M11.1732 19.75H14.4232V6.75H11.1732M16.5898 19.75H19.8398V0.25H16.5898V19.75Z" [attr.fill]="color"/>
        </svg>
    `
})
export class IconSignalPhoneComponent {
    @Input() size: number = 18;
    @Input() color: string = 'var(--highlight)';
}
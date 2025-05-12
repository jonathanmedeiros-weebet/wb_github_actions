import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-envelope',
  template: `
    <svg class="icon-envelope" xmlns="http://www.w3.org/2000/svg" [attr.width]="width" [attr.height]="height" viewBox="0 0 160 97" fill="none">
      <g clip-path="url(#clip0_1890_962)">
        <rect x="0.724121" y="0.526611" [attr.width]="width" [attr.height]="height" rx="8.94473" [attr.fill]="color"/>
        <g filter="url(#filter0_d_1890_962)">
          <path d="M79.9496 41.5969L178.513 109.532H-18.6136L79.9496 41.5969Z" [attr.fill]="color"/>
        </g>
        <g filter="url(#filter1_d_1890_962)">
          <path d="M79.9491 59.5796L178.512 -8.35551H-18.6141L79.9491 59.5796Z" [attr.fill]="color"/>
        </g>
      </g>
      <defs>
        <filter id="filter0_d_1890_962" x="-35.8643" y="20.5129" width="231.628" height="102.436" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="-3.83346"/>
          <feGaussianBlur stdDeviation="8.62528"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1890_962"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1890_962" result="shape"/>
        </filter>
        <filter id="filter1_d_1890_962" x="-29.9868" y="-14.6168" width="219.872" height="90.6802" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="5.11128"/>
          <feGaussianBlur stdDeviation="5.68629"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1890_962"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1890_962" result="shape"/>
        </filter>
        <clipPath id="clip0_1890_962">
          <rect x="0.724121" y="0.526611" width="158.45" height="96.4753" rx="8.94473" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  `,
})
export class IconEnvelopeComponent {
  @Input() width: number = 160;
  @Input() height: number = 97;
  @Input() color: string = 'var(--foreground)';
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-skeleton-casino-virtuals',
  templateUrl: './skeleton-casino-virtuals.component.html',
  styleUrls: ['./skeleton-casino-virtuals.component.css']
})
export class SkeletonCasinoVirtualsComponent {
  items = Array(30).fill(0); 
}

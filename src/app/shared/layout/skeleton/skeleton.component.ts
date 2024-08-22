import { Component, Input } from '@angular/core';

type skeletonType = 'casino' | 'provider' | 'casino-filter-bar' | 'banner' | 'small-banner';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.css']
})
export class SkeletonComponent {
  @Input() type: skeletonType = 'casino'

  get showSkeletonCasino(): boolean {
    return this.type === 'casino';
  }

  get showSkeletonProvider(): boolean {
    return this.type === 'provider';
  }

  get showSkeletonCasinoFilterBar(): boolean {
    return this.type === 'casino-filter-bar';
  }

  get showSkeletonBanner(): boolean {
    return this.type === 'banner';
  }

  get showSkeletonSmallBanner(): boolean {
    return this.type === 'small-banner';
  }
}

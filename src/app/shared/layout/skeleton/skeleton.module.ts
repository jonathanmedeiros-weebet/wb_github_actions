import {NgModule} from '@angular/core';
import { SkeletonComponent } from './skeleton.component';
import { SkeletonCasinoComponent } from './types/skeleton-casino/skeleton-casino.component';
import { CommonModule } from '@angular/common';
import { SkeletonProviderComponent } from './types/skeleton-provider/skeleton-provider.component';
import { SkeletonCasinoFilterBarComponent } from './types/skeleton-casino-filter-bar/skeleton-casino-filter-bar.component';
import { SkeletonBannerComponent } from './types/skeleton-banner/skeleton-banner.component';

@NgModule({
    declarations: [
       SkeletonComponent,
       SkeletonCasinoComponent,
       SkeletonProviderComponent,
       SkeletonCasinoFilterBarComponent,
       SkeletonBannerComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
       SkeletonComponent
    ],
})
export class SkeletonModule {}

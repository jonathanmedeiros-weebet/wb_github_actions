import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CasinoRoutingModule } from './casino-routing.module';
import { WallComponent } from './wall/wall.component';
import { GameviewComponent } from './gameview/gameview.component';
import { CasinoWrapperComponent } from './wrapper/wrapper.component';
import { SafeIframePipe } from '../shared/utils/pipes/safe-iframe.pipe';
import { SharedModule } from '../shared/shared.module';
import { LiveComponent } from './live/live.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';


@NgModule({
  declarations: [
    WallComponent,
    GameviewComponent,
    CasinoWrapperComponent,
    LiveComponent
  ],
  imports: [
    SharedModule,
    CasinoRoutingModule,
    NgxSkeletonLoaderModule,
  ]
})
export class CasinoModule { }

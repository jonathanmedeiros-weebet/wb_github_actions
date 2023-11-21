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
import {TranslateModule} from '@ngx-translate/core';
import {NgxPaginationModule} from "ngx-pagination";
import {WallLiveComponent} from "./wall-live/wall-live.component";


@NgModule({
  declarations: [
    WallComponent,
      WallLiveComponent,
    GameviewComponent,
    CasinoWrapperComponent,
    LiveComponent
  ],
    imports: [
        SharedModule,
        CasinoRoutingModule,
        NgxSkeletonLoaderModule,
        TranslateModule,
        NgxPaginationModule,
    ]
})
export class CasinoModule { }

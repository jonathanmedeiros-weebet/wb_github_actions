import { NgModule } from '@angular/core';

import { CasinoRoutingModule } from './casino-routing.module';
import { WallComponent } from './wall/wall.component';
import { GameviewComponent } from './gameview/gameview.component';
import { CasinoWrapperComponent } from './wrapper/wrapper.component';
import { SharedModule } from '../shared/shared.module';
import { LiveComponent } from './live/live.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {TranslateModule} from '@ngx-translate/core';
import {NgxPaginationModule} from "ngx-pagination";
import {WallLiveComponent} from "./wall-live/wall-live.component";
import { AngularSvgIconModule } from 'angular-svg-icon';
import { WallSectionComponent } from './wall/components/wall-section/wall-section.component';
import { WallSearchBarComponent } from './wall/components/wall-search-bar/wall-search-bar.component';
import { WallProviderCardComponent } from './wall/components/wall-provider-card/wall-provider-card.component';
import { WallGameCardComponent } from './wall/components/wall-game-card/wall-game-card.component';

@NgModule({
  declarations: [
    WallComponent,
    WallLiveComponent,
    GameviewComponent,
    CasinoWrapperComponent,
    LiveComponent,
    WallSectionComponent,
    WallSearchBarComponent,
    WallProviderCardComponent,
    WallGameCardComponent,
  ],
    imports: [
      SharedModule,
      CasinoRoutingModule,
      NgxSkeletonLoaderModule,
      TranslateModule,
      NgxPaginationModule,
      AngularSvgIconModule
    ]
})
export class CasinoModule { }

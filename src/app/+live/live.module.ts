import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { LiveRoutingModule } from './live-routing.module';
import { LiveComponent } from './live.component';
import { LiveService } from '../services';

@NgModule({
    imports: [SharedModule, LiveRoutingModule],
    declarations: [LiveComponent],
    providers: [LiveService]
})
export class LiveModule { }

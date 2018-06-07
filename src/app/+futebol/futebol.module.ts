import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { FutebolRoutingModule } from './futebol-routing.module';
import { FutebolComponent } from './futebol.component';

@NgModule({
    imports: [SharedModule, FutebolRoutingModule],
    declarations: [FutebolComponent],
    providers: []
})
export class FutebolModule { }

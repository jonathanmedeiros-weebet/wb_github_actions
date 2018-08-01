import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { FutebolRoutingModule } from './futebol-routing.module';
import { FutebolComponent } from './futebol.component';

import { JogoService, CampeonatoService } from './../services';

@NgModule({
    imports: [SharedModule, FutebolRoutingModule],
    declarations: [FutebolComponent],
    providers: [JogoService, CampeonatoService]
})
export class FutebolModule { }

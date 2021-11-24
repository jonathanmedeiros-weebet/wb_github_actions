import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { FutebolRoutingModule } from './futebol-routing.module';
import { JogoService } from './../../services';

@NgModule({
    imports: [
        SharedModule,
        FutebolRoutingModule
    ],
    declarations: [],
    providers: [
        JogoService,
    ]
})
export class FutebolModule { }

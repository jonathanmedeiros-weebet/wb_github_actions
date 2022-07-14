import {NgModule} from '@angular/core';

import {SharedModule} from '../../shared/shared.module';
import {FutebolRoutingModule} from './futebol-routing.module';
import {ApostaEsportivaService, JogoService} from './../../services';

@NgModule({
    imports: [
        SharedModule,
        FutebolRoutingModule
    ],
    declarations: [],
    providers: [
        JogoService,
        ApostaEsportivaService
    ]
})
export class FutebolModule { }

import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { EsportesModule } from './../esportes.module';
import { FutebolRoutingModule } from './futebol-routing.module';
import { JogoService, BilheteEsportivoService, ApostaEsportivaService } from './../../services';

@NgModule({
    imports: [
        SharedModule,
        EsportesModule,
        FutebolRoutingModule
    ],
    declarations: [],
    providers: [
        JogoService,
        BilheteEsportivoService,
        ApostaEsportivaService
    ]
})
export class FutebolModule { }

import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { BasqueteRoutingModule } from './basquete-routing.module';
import { EsportesModule } from './../esportes.module';
import { JogoService, BilheteEsportivoService, ApostaEsportivaService } from './../../services';

@NgModule({
    imports: [
        SharedModule,
        EsportesModule,
        BasqueteRoutingModule
    ],
    declarations: [],
    providers: [
        JogoService,
        BilheteEsportivoService,
        ApostaEsportivaService
    ]
})
export class BasqueteModule { }

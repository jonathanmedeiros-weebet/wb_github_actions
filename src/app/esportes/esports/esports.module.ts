import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { EsportsRoutingModule } from './esports-routing.module';
import { EsportesModule } from './../esportes.module';
import { JogoService, BilheteEsportivoService, ApostaEsportivaService } from './../../services';

@NgModule({
    imports: [
        SharedModule,
        EsportesModule,
        EsportsRoutingModule
    ],
    declarations: [],
    providers: [
        JogoService,
        BilheteEsportivoService,
        ApostaEsportivaService
    ]
})
export class EsportsModule { }

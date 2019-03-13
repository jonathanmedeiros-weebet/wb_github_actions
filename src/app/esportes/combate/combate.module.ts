import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { EsportesModule } from './../esportes.module';
import { CombateRoutingModule } from './combate-routing.module';
import { JogoService, BilheteEsportivoService, ApostaEsportivaService } from './../../services';

@NgModule({
    imports: [
        SharedModule,
        EsportesModule,
        CombateRoutingModule
    ],
    declarations: [],
    providers: [
        JogoService,
        BilheteEsportivoService,
        ApostaEsportivaService
    ]
})
export class CombateModule { }

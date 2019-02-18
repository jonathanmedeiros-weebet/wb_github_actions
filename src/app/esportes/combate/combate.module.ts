import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { CombateRoutingModule } from './combate-routing.module';
import { EsportesWrapperModule } from '../wrapper/esportes-wrapper.module';
import { JogoService, BilheteEsportivoService, ApostaEsportivaService } from './../../services';

@NgModule({
    imports: [
        SharedModule,
       CombateRoutingModule,
        EsportesWrapperModule
    ],
    declarations: [],
    providers: [
        JogoService,
        BilheteEsportivoService,
        ApostaEsportivaService
    ]
})
export class CombateModule { }

import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { BasqueteRoutingModule } from './basquete-routing.module';
import { EsportesWrapperModule } from '../wrapper/esportes-wrapper.module';
import { JogoService, BilheteEsportivoService, ApostaEsportivaService } from './../../services';

@NgModule({
    imports: [
        SharedModule,
        BasqueteRoutingModule,
        EsportesWrapperModule
    ],
    declarations: [],
    providers: [
        JogoService,
        BilheteEsportivoService,
        ApostaEsportivaService
    ]
})
export class BasqueteModule { }

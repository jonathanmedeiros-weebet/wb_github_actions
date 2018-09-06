import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { FutebolRoutingModule } from './futebol-routing.module';
import { FutebolWrapperComponent } from './wrapper/futebol-wrapper.component';
import { BilheteEsportivoComponent } from '../bilhete/bilhete-esportivo.component';
import { JogoService, CampeonatoService, BilheteEsportivoService, ApostaEsportivaService } from './../../services';

@NgModule({
    imports: [
        SharedModule,
        FutebolRoutingModule
    ],
    declarations: [
        FutebolWrapperComponent,
        BilheteEsportivoComponent
    ],
    providers: [
        JogoService,
        CampeonatoService,
        BilheteEsportivoService,
        ApostaEsportivaService
    ]
})
export class FutebolModule { }

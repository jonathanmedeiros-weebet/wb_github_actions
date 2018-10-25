import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { FutebolRoutingModule } from './futebol-routing.module';
import { FutebolWrapperComponent } from './wrapper/futebol-wrapper.component';
import { BilheteEsportivoComponent } from '../bilhete/bilhete-esportivo.component';
import { JogoService, BilheteEsportivoService, ApostaEsportivaService } from './../../services';

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
        BilheteEsportivoService,
        ApostaEsportivaService
    ]
})
export class FutebolModule { }

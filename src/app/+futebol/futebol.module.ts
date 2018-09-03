import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { FutebolRoutingModule } from './futebol-routing.module';
import { FutebolWrapperComponent } from './wrapper/futebol-wrapper.component';
import { FutebolFooterComponent } from './footer/futebol-footer.component';
import { FutebolNavigationComponent } from './navigation/futebol-navigation.component';
import { FutebolTicketComponent } from './ticket/futebol-ticket.component';
import { JogosComponent } from './jogos/jogos.component';
import { JogoComponent } from './jogo/jogo.component';

import { JogoService, CampeonatoService, BilheteEsportivoService, ApostaEsportivaService } from './../services';

@NgModule({
    imports: [SharedModule, FutebolRoutingModule],
    declarations: [
        FutebolWrapperComponent,
        FutebolFooterComponent,
        FutebolNavigationComponent,
        FutebolTicketComponent,
        JogosComponent,
        JogoComponent
    ],
    providers: [
        JogoService,
        CampeonatoService,
        BilheteEsportivoService,
        ApostaEsportivaService
    ]
})
export class FutebolModule { }

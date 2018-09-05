import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { FutebolRoutingModule } from './futebol-routing.module';
import { FutebolWrapperComponent } from './wrapper/futebol-wrapper.component';
import { FutebolNavigationComponent } from './navigation/futebol-navigation.component';
import { FutebolFooterComponent } from './footer/futebol-footer.component';
import { JogosComponent } from './jogos/jogos.component';
import { JogoComponent } from './jogo/jogo.component';
import { JogoService, CampeonatoService, BilheteEsportivoService, ApostaEsportivaService } from './../../services';
import { SportsTicketComponent } from '../sports-ticket/sports-ticket.component';

@NgModule({
    imports: [
        SharedModule,
        FutebolRoutingModule
    ],
    declarations: [
        FutebolWrapperComponent,
        FutebolNavigationComponent,
        FutebolFooterComponent,
        JogosComponent,
        JogoComponent,
        SportsTicketComponent
    ],
    providers: [
        JogoService,
        CampeonatoService,
        BilheteEsportivoService,
        ApostaEsportivaService
    ]
})
export class FutebolModule { }

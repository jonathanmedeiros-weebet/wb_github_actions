import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { FutebolRoutingModule } from './futebol-routing.module';
import { FutebolComponent } from './wrapper/futebol.component';
import { JogosComponent } from './jogos/jogos.component';
import { JogoComponent } from './jogo/jogo.component';

import { JogoService, CampeonatoService, BilheteEsportivoService } from './../services';

@NgModule({
    imports: [SharedModule, FutebolRoutingModule],
    declarations: [
        FutebolComponent,
        JogosComponent,
        JogoComponent
    ],
    providers: [
        JogoService,
        CampeonatoService,
        BilheteEsportivoService
    ]
})
export class FutebolModule { }

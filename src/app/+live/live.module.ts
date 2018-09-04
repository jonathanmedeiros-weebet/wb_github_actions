import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { LiveRoutingModule } from './live-routing.module';
import { LiveListagemComponent } from './listagem/live-listagem.component';
import { LiveJogoComponent } from './jogo/live-jogo.component';
import { LiveService, JogoService } from '../services';

@NgModule({
    imports: [SharedModule, LiveRoutingModule],
    declarations: [LiveListagemComponent, LiveJogoComponent],
    providers: [LiveService, JogoService]
})
export class LiveModule { }

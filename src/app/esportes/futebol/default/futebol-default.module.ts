import { NgModule } from '@angular/core';

import { SharedModule } from './../../../shared/shared.module';
import { EsportesModule } from './../../esportes.module';
import { FutebolDefaultRoutingModule } from './futebol-default-routing.module';
import { FutebolDefaultWrapperComponent } from './wrapper/futebol-default-wrapper.component';
import { FutebolListagemComponent } from './listagem/futebol-listagem.component';
import { FutebolJogoComponent } from './jogo/futebol-jogo.component';

@NgModule({
    imports: [
        SharedModule,
        EsportesModule,
        FutebolDefaultRoutingModule
    ],
    declarations: [
        FutebolDefaultWrapperComponent,
        FutebolListagemComponent,
        FutebolJogoComponent
    ],
    providers: []
})
export class FutebolDefaultModule { }

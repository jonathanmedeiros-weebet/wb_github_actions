import { NgModule } from '@angular/core';

import { SharedModule } from './../../../shared/shared.module';
import { FutebolDefaultRoutingModule } from './futebol-default-routing.module';
import { FutebolDefaultWrapperComponent } from './wrapper/futebol-default-wrapper.component';
import { FutebolNavigationComponent } from './navigation/futebol-navigation.component';
import { FutebolFooterComponent } from './footer/futebol-footer.component';
import { FutebolListagemComponent } from './listagem/futebol-listagem.component';
import { FutebolJogoComponent } from './jogo/futebol-jogo.component';

@NgModule({
    imports: [
        SharedModule,
        FutebolDefaultRoutingModule
    ],
    declarations: [
        FutebolNavigationComponent,
        FutebolFooterComponent,
        FutebolDefaultWrapperComponent,
        FutebolListagemComponent,
        FutebolJogoComponent
    ],
    providers: []
})
export class FutebolDefaultModule { }

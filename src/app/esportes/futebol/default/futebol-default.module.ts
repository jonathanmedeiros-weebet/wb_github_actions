import { NgModule } from '@angular/core';

import { SharedModule } from './../../../shared/shared.module';
import { FutebolDefaultRoutingModule } from './futebol-default-routing.module';
import { FutebolDefaultWrapperComponent } from './wrapper/futebol-default-wrapper.component';
import { FutebolListagemComponent } from './listagem/futebol-listagem.component';
import { FutebolJogoComponent } from './jogo/futebol-jogo.component';
import { BannersComponent } from '../../../banners/banners.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        SharedModule,
        FutebolDefaultRoutingModule,
        NgbModule,
        NgbCarouselModule
    ],
    declarations: [
        FutebolDefaultWrapperComponent,
        FutebolListagemComponent,
        FutebolJogoComponent,
        BannersComponent
    ],
    providers: []
})
export class FutebolDefaultModule { }

import {NgModule} from '@angular/core';

import {SharedModule} from '../../../shared/shared.module';
import {FutebolDefaultRoutingModule} from './futebol-default-routing.module';
import {FutebolDefaultWrapperComponent} from './wrapper/futebol-default-wrapper.component';
import {FutebolListagemComponent} from './listagem/futebol-listagem.component';
import {FutebolJogoComponent} from './jogo/futebol-jogo.component';
import {NgbActiveModal, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {EsportesModule} from '../../esportes.module';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {TranslateModule} from '@ngx-translate/core';
import { HomeModule } from '../../../home/home.module';

@NgModule({
    imports: [
        SharedModule,
        FutebolDefaultRoutingModule,
        CarouselModule,
        NgbNavModule,
        EsportesModule,
        TranslateModule,
        HomeModule
    ],
    declarations: [
        FutebolDefaultWrapperComponent,
        FutebolListagemComponent,
        FutebolJogoComponent,
    ],
    providers: [
        NgbActiveModal
    ]
})
export class FutebolDefaultModule {
}

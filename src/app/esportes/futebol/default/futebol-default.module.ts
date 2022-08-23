import {NgModule} from '@angular/core';

import {SharedModule} from '../../../shared/shared.module';
import {FutebolDefaultRoutingModule} from './futebol-default-routing.module';
import {FutebolDefaultWrapperComponent} from './wrapper/futebol-default-wrapper.component';
import {FutebolListagemComponent} from './listagem/futebol-listagem.component';
import {FutebolJogoComponent} from './jogo/futebol-jogo.component';
import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {EsportesModule} from '../../esportes.module';
import {RegioesDestaqueService} from '../../../services';

@NgModule({
    imports: [
        SharedModule,
        FutebolDefaultRoutingModule,
        NgbNavModule,
        EsportesModule
    ],
    declarations: [
        FutebolDefaultWrapperComponent,
        FutebolListagemComponent,
        FutebolJogoComponent
    ],
    providers: [RegioesDestaqueService]
})
export class FutebolDefaultModule {
}

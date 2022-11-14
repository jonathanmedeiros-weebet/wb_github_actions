import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { GenericoRoutingModule } from './generico-routing.module';
import { GenericoWrapperComponent } from './wrapper/generico-wrapper.component';
import { GenericoListagemComponent } from './listagem/generico-listagem.component';
import { BasqueteJogoComponent } from './basquete-jogo/basquete-jogo.component';
import {NgbActiveModal, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { JogoService } from '../../services';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
    imports: [
        SharedModule,
        GenericoRoutingModule,
        NgbNavModule,
        NgbCarouselModule,
        Ng2SearchPipeModule
    ],
    declarations: [
        GenericoWrapperComponent,
        GenericoListagemComponent,
        BasqueteJogoComponent
    ],
    providers: [
        JogoService,
        NgbActiveModal
    ]
})
export class GenericoModule { }

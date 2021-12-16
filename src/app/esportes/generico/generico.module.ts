import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { GenericoRoutingModule } from './generico-routing.module';
import { GenericoWrapperComponent } from './wrapper/generico-wrapper.component';
import { GenericoListagemComponent } from './listagem/generico-listagem.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { JogoService } from '../../services';

@NgModule({
    imports: [
        SharedModule,
        GenericoRoutingModule,
        NgbNavModule,
        NgbCarouselModule
    ],
    declarations: [
        GenericoWrapperComponent,
        GenericoListagemComponent
    ],
    providers: [
        JogoService,
    ]
})
export class GenericoModule { }

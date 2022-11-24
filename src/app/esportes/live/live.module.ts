import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { LiveRoutingModule } from './live-routing.module';
import { LiveListagemComponent } from './listagem/live-listagem.component';
import { LiveWrapperComponent } from './wrapper/live-wrapper.component';
import { LiveJogoComponent } from './jogo/live-jogo.component';
import { JogoService, LiveService, CampinhoService } from '../../services';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
    imports: [
        SharedModule,
        LiveRoutingModule,
        NgbNavModule,
        Ng2SearchPipeModule
    ],
    declarations: [
        LiveWrapperComponent,
        LiveListagemComponent,
        LiveJogoComponent
    ],
    providers: [
        LiveService,
        JogoService,
        CampinhoService
    ]
})
export class LiveModule { }

import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { LiveRoutingModule } from './live-routing.module';
import { LiveListagemComponent } from './listagem/live-listagem.component';
import { LiveWrapperComponent } from './wrapper/live-wrapper.component';
import { LiveJogoComponent } from './jogo/live-jogo.component';
import { JogoService, LiveService } from '../../services';
import { NgbActiveModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        SharedModule,
        LiveRoutingModule,
        NgbNavModule,
    ],
    declarations: [
        LiveWrapperComponent,
        LiveListagemComponent,
        LiveJogoComponent
    ],
    providers: [
        LiveService,
        JogoService,
        NgbActiveModal
    ]
})
export class LiveModule { }

import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { LiveRoutingModule } from './live-routing.module';
import { LiveListagemComponent } from './listagem/live-listagem.component';
import { LiveWrapperComponent } from './wrapper/live-wrapper.component';
import { LiveJogoComponent } from './jogo/live-jogo.component';
import { JogoService, LiveService } from '../../services';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
    imports: [
        SharedModule,
        LiveRoutingModule,
        Ng2SearchPipeModule
    ],
    declarations: [
        LiveWrapperComponent,
        LiveListagemComponent,
        LiveJogoComponent
    ],
    providers: [
        LiveService,
        JogoService
    ]
})
export class LiveModule { }

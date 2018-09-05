import { NgModule } from '@angular/core';

import { SharedModule } from './../../../shared/shared.module';
import { LiveRoutingModule } from './live-routing.module';
import { LiveListagemComponent } from './listagem/live-listagem.component';
import { LiveWrapperComponent } from './wrapper/live-wrapper.component';
import { LiveJogoComponent } from './jogo/live-jogo.component';
import { LiveService } from '../../../services';

@NgModule({
    imports: [
        SharedModule,
        LiveRoutingModule
    ],
    declarations: [
        LiveWrapperComponent,
        LiveListagemComponent,
        LiveJogoComponent
    ],
    providers: [
        LiveService
    ]
})
export class LiveModule { }

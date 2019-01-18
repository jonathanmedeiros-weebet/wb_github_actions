import { NgModule } from '@angular/core';

import { SharedModule } from './../../../shared/shared.module';
import { BasqueteDefaultRoutingModule } from './basquete-default-routing.module';
import { BasqueteDefaultWrapperComponent } from './wrapper/basquete-default-wrapper.component';
import { BasqueteFooterComponent } from './footer/basquete-footer.component';
import { BasqueteListagemComponent } from './listagem/basquete-listagem.component';
import { BasqueteJogoComponent } from './jogo/basquete-jogo.component';

@NgModule({
    imports: [
        SharedModule,
        BasqueteDefaultRoutingModule
    ],
    declarations: [
        BasqueteFooterComponent,
        BasqueteDefaultWrapperComponent,
        BasqueteListagemComponent,
        BasqueteJogoComponent
    ],
    providers: []
})
export class BasqueteDefaultModule { }

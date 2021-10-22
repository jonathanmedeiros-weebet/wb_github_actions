import { NgModule } from '@angular/core';

import { SharedModule } from './../../../shared/shared.module';
import { PreEventoRoutingModule } from './pre-evento-routing.module';
import { PreEventoWrapperComponent } from './wrapper/pre-evento-wrapper.component';
import { PreEventoListagemComponent } from './listagem/pre-evento-listagem.component';

@NgModule({
    imports: [
        SharedModule,
        PreEventoRoutingModule,
    ],
    declarations: [
        PreEventoWrapperComponent,
        PreEventoListagemComponent
    ],
    providers: []
})
export class PreEventoModule { }

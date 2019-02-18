import { NgModule } from '@angular/core';

import { SharedModule } from './../../../shared/shared.module';
import { CombateDefaultRoutingModule } from './combate-default-routing.module';
import { CombateDefaultWrapperComponent } from './wrapper/combate-default-wrapper.component';
import { CombateListagemComponent } from './listagem/combate-listagem.component';
import { CombateEventoComponent } from './evento/combate-evento.component';

@NgModule({
    imports: [
        SharedModule,
        CombateDefaultRoutingModule
    ],
    declarations: [
        CombateDefaultWrapperComponent,
        CombateListagemComponent,
        CombateEventoComponent
    ],
    providers: []
})
export class CombateDefaultModule { }

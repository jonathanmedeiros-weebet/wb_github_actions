import { NgModule } from '@angular/core';

import { SharedModule } from './../../../shared/shared.module';
import { CombateDefaultRoutingModule } from './combate-default-routing.module';
import { CombateDefaultWrapperComponent } from './wrapper/combate-default-wrapper.component';
import { CombateListagemComponent } from './listagem/combate-listagem.component';

@NgModule({
    imports: [
        SharedModule,
        CombateDefaultRoutingModule
    ],
    declarations: [
        CombateDefaultWrapperComponent,
        CombateListagemComponent,
    ],
    providers: []
})
export class CombateDefaultModule { }

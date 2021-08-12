import { NgModule } from '@angular/core';

import { SharedModule } from './../../../shared/shared.module';
import { BasqueteDefaultRoutingModule } from './basquete-default-routing.module';
import { BasqueteDefaultWrapperComponent } from './wrapper/basquete-default-wrapper.component';
import { BasqueteListagemComponent } from './listagem/basquete-listagem.component';

@NgModule({
    imports: [
        SharedModule,
        BasqueteDefaultRoutingModule,
    ],
    declarations: [
        BasqueteDefaultWrapperComponent,
        BasqueteListagemComponent
    ],
    providers: []
})
export class BasqueteDefaultModule { }

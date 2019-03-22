import { NgModule } from '@angular/core';

import { SharedModule } from './../../../shared/shared.module';
import { EsportesModule } from './../../esportes.module';
import { BasqueteDefaultRoutingModule } from './basquete-default-routing.module';
import { BasqueteDefaultWrapperComponent } from './wrapper/basquete-default-wrapper.component';
import { BasqueteListagemComponent } from './listagem/basquete-listagem.component';
import { BasqueteEventoComponent } from './evento/basquete-evento.component';

@NgModule({
    imports: [
        SharedModule,
        EsportesModule,
        BasqueteDefaultRoutingModule,
    ],
    declarations: [
        BasqueteDefaultWrapperComponent,
        BasqueteListagemComponent,
        BasqueteEventoComponent
    ],
    providers: []
})
export class BasqueteDefaultModule { }

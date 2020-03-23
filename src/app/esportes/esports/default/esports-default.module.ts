import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared/shared.module';
import { EsportsDefaultRoutingModule } from './esports-default-routing.module';
import { EsportsDefaultWrapperComponent } from './wrapper/esports-default-wrapper.component';
import { EsportsListagemComponent } from './listagem/esports-listagem.component';

@NgModule({
    imports: [
        SharedModule,
        EsportsDefaultRoutingModule,
    ],
    declarations: [
        EsportsDefaultWrapperComponent,
        EsportsListagemComponent
    ],
    providers: []
})
export class EsportsDefaultModule { }

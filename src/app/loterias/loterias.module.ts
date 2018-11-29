import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { LoteriasRoutingModule } from './loterias-routing.module';
import { QuininhaComponent } from './quininha/quininha.component';
import { SeninhaComponent } from './seninha/seninha.component';
import { ApostaService, PreApostaLoteriaService, SorteioService, TipoApostaService } from './../services';

@NgModule({
    imports: [
        SharedModule,
        LoteriasRoutingModule
    ],
    declarations: [
        SeninhaComponent,
        QuininhaComponent
    ],
    providers: [
        ApostaService,
        PreApostaLoteriaService,
        SorteioService,
        TipoApostaService,
    ]
})
export class LoteriasModule { }

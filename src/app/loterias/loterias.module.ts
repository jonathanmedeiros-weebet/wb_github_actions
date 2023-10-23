import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { LoteriasRoutingModule } from './loterias-routing.module';
import { QuininhaComponent } from './quininha/quininha.component';
import { SeninhaComponent } from './seninha/seninha.component';
import { ApostaLoteriaService, PreApostaLoteriaService, SorteioService, TipoApostaLoteriaService } from './../services';
import { LoteriaPopularComponent } from './loteria-popular/loteria-popular.component';

@NgModule({
    imports: [
        SharedModule,
        LoteriasRoutingModule
    ],
    declarations: [
        SeninhaComponent,
        QuininhaComponent,
        LoteriaPopularComponent
    ],
    providers: [
        ApostaLoteriaService,
        PreApostaLoteriaService,
        SorteioService,
        TipoApostaLoteriaService,
    ]
})
export class LoteriasModule { }

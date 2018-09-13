import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { LoteriasRoutingModule } from './loterias-routing.module';
import { QuininhaComponent } from './quininha/quininha.component';
import { SeninhaComponent } from './seninha/seninha.component';
import { ResultadosLoteriaComponent } from './resultados/resultados-loteria.component';
import { ApuracaoLoteriaComponent } from './apuracao/apuracao-loteria.component';
import { ApostaService, SorteioService, TipoApostaService } from './../services';

@NgModule({
    imports: [
        SharedModule,
        LoteriasRoutingModule
    ],
    declarations: [
        ApuracaoLoteriaComponent,
        ResultadosLoteriaComponent,
        SeninhaComponent,
        QuininhaComponent
    ],
    providers: [
        ApostaService,
        SorteioService,
        TipoApostaService
    ]
})
export class LoteriasModule { }

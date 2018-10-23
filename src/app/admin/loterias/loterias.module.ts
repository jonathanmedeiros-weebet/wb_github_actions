import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { AdminLoteriasRoutingModule } from './loterias-routing.module';
import { AdminApuracaoLoteriaComponent } from './apuracao/apuracao-loteria.component';
import { AdminResultadosLoteriaComponent } from './resultados/resultados-loteria.component';
import { ApostaService, SorteioService, TipoApostaService } from './../../services';

@NgModule({
    imports: [
        SharedModule,
        AdminLoteriasRoutingModule
    ],
    declarations: [
        AdminApuracaoLoteriaComponent,
        AdminResultadosLoteriaComponent
    ],
    providers: [
        ApostaService,
        SorteioService,
        TipoApostaService
    ]
})
export class AdminLoteriasModule { }

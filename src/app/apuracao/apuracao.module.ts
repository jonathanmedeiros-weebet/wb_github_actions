import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ApuracaoRoutingModule } from './apuracao-routing.module';
import { ApuracaoLoteriaComponent } from './loteria/apuracao-loteria.component';
import { ApuracaoEsporteComponent } from './esportes/apuracao-esporte.component';
import { ApuracaoConsolidadaComponent } from './consolidada/apuracao-consolidada.component';
import { SorteioService, ApostaLoteriaService, ApostaEsportivaService, RelatorioService } from '../services';

@NgModule({
    imports: [
        SharedModule,
        ApuracaoRoutingModule
    ],
    exports: [],
    declarations: [
        ApuracaoEsporteComponent,
        ApuracaoLoteriaComponent,
        ApuracaoConsolidadaComponent
    ],
    providers: [
        SorteioService,
        ApostaLoteriaService,
        ApostaEsportivaService,
        RelatorioService
    ],
})
export class ApuracaoModule { }

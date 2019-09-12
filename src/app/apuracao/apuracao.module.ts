import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ApuracaoRoutingModule } from './apuracao-routing.module';
import { ApuracaoLoteriaComponent } from './loteria/apuracao-loteria.component';
import { ApuracaoEsporteComponent } from './esportes/apuracao-esporte.component';
import { ApuracaoConsolidadaComponent } from './consolidada/apuracao-consolidada.component';
import { ApuracaoAcumuladaoComponent } from './acumuladao/apuracao-acumuladao.component';
import {
    SorteioService,
    ApostaLoteriaService,
    ApostaEsportivaService,
    RelatorioService,
    AcumuladaoService
} from '../services';

@NgModule({
    imports: [
        SharedModule,
        ApuracaoRoutingModule
    ],
    exports: [],
    declarations: [
        ApuracaoEsporteComponent,
        ApuracaoLoteriaComponent,
        ApuracaoConsolidadaComponent,
        ApuracaoAcumuladaoComponent
    ],
    providers: [
        SorteioService,
        ApostaLoteriaService,
        ApostaEsportivaService,
        RelatorioService,
        AcumuladaoService
    ],
})
export class ApuracaoModule { }

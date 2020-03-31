import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ApuracaoRoutingModule } from './apuracao-routing.module';
import { ApuracaoLoteriaComponent } from './loteria/apuracao-loteria.component';
import { ApuracaoEsporteComponent } from './esportes/apuracao-esporte.component';
import { ApuracaoConsolidadaComponent } from './consolidada/apuracao-consolidada.component';
import { ApuracaoAcumuladaoComponent } from './acumuladao/apuracao-acumuladao.component';
import { ApuracaoDesafioComponent } from './desafio/apuracao-desafio.component';
import { ApuracaoListagemComponent } from './apuracao-listagem/apuracao-listagem.component';
import {
    SorteioService,
    ApostaLoteriaService,
    ApostaEsportivaService,
    RelatorioService,
    AcumuladaoService,
    DesafioApostaService
} from '../services';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        SharedModule,
        ApuracaoRoutingModule,
        NgbTabsetModule
    ],
    exports: [],
    declarations: [
        ApuracaoEsporteComponent,
        ApuracaoLoteriaComponent,
        ApuracaoConsolidadaComponent,
        ApuracaoAcumuladaoComponent,
        ApuracaoDesafioComponent,
        ApuracaoListagemComponent
    ],
    providers: [
        SorteioService,
        DesafioApostaService,
        ApostaLoteriaService,
        ApostaEsportivaService,
        RelatorioService,
        AcumuladaoService
    ],
})
export class ApuracaoModule { }

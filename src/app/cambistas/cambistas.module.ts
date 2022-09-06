import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {CambistasRoutingModule} from './cambistas-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ApuracaoComponent} from './apuracao/apuracao.component';
import {RelatorioService} from '../shared/services/relatorio.service';
import {MessageService} from '../shared/services/utils/message.service';
import { NgChartsModule } from 'ng2-charts';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ApostaComponent } from './aposta/aposta.component';
import { TabelaComponent } from './tabela/tabela.component';

@NgModule({
    declarations: [
        ApuracaoComponent,
        DashboardComponent,
        ApostaComponent,
        TabelaComponent
    ],
    imports: [
        SharedModule,
        CambistasRoutingModule,
        NgChartsModule,
        NgbModule
    ],
    providers: [
        RelatorioService,
        MessageService
    ]
})
export class CambistasModule {
}

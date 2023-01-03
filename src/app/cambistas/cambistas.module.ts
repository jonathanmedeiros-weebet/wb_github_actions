import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {CambistasRoutingModule} from './cambistas-routing.module';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ApuracaoComponent} from './apuracao/apuracao.component';
import {RelatorioService} from '../shared/services/relatorio.service';
import {MessageService} from '../shared/services/utils/message.service';
import { NgChartsModule } from 'ng2-charts';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ApostaComponent } from './aposta/aposta.component';
import { TabelaComponent } from './tabela/tabela.component';
import { DesafioApostaService, AcumuladaoService } from '../services';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FinanceiroComponent } from './financeiro/financeiro.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CartaoComponent } from './cartao/cartao.component';
import { SolicitacaoSaqueComponent } from './solicitacao-saque/solicitacao-saque.component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    declarations: [
        ApuracaoComponent,
        DashboardComponent,
        ApostaComponent,
        TabelaComponent,
        FinanceiroComponent,
        CartaoComponent,
        SolicitacaoSaqueComponent
    ],
    imports: [
        SharedModule,
        CambistasRoutingModule,
        NgChartsModule,
        NgbModule,
        NgxSkeletonLoaderModule.forRoot({loadingText: 'This item is actually loading...'}),
        Ng2SearchPipeModule,
        TranslateModule
    ],
    providers: [
        RelatorioService,
        MessageService,
        DesafioApostaService,
        AcumuladaoService,
        NgbActiveModal
    ]
})
export class CambistasModule {
}

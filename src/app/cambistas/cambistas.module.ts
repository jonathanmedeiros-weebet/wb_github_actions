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
import { MovimentacaoComponent } from './movimentacao/movimentacao.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CartaoComponent } from './cartao/cartao.component';
import { SolicitacaoSaqueComponent } from './solicitacao-saque/solicitacao-saque.component';
import { JogoService } from '../shared/services/aposta-esportiva/jogo.service';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@NgModule({
    declarations: [
        ApuracaoComponent,
        DashboardComponent,
        ApostaComponent,
        TabelaComponent,
        MovimentacaoComponent,
        CartaoComponent,
        SolicitacaoSaqueComponent,
    ],
    imports: [
        SharedModule,
        CambistasRoutingModule,
        NgChartsModule,
        NgbModule,
        NgxMaskDirective,
        NgxMaskPipe,
        NgxSkeletonLoaderModule.forRoot({loadingText: 'This item is actually loading...'}),
    ],
    providers: [
        RelatorioService,
        MessageService,
        DesafioApostaService,
        AcumuladaoService,
        NgbActiveModal,
        JogoService,
        provideNgxMask()
    ]
})
export class CambistasModule {
}

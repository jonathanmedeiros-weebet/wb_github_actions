import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ApuracaoComponent} from './apuracao/apuracao.component';
import {PagesLayoutComponent} from '../shared/layout/app-layouts';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ApostaComponent } from './aposta/aposta.component';
import { TabelaComponent } from './tabela/tabela.component';
import { FinanceiroComponent } from './financeiro/financeiro.component';
import { CartaoComponent } from './cartao/cartao.component';
import { SolicitacaoSaqueComponent } from './solicitacao-saque/solicitacao-saque.component';

const routes: Routes = [{
    path: '',
    children: [
        {
            path: 'deposito',
            loadChildren: () => import('./deposito/deposito.module').then(a => a.DepositoModule)
        },
        {
            path: 'apuracao',
            component: PagesLayoutComponent,
            children: [
                {
                    path: '',
                    component: ApuracaoComponent
                }
            ]
        },
        {
            path: 'financeiro',
            component: PagesLayoutComponent,
            children: [
                {
                    path: '',
                    component: FinanceiroComponent
                }
            ]
        },
        {
            path: 'dashboard',
            component: PagesLayoutComponent,
            children: [
                {
                    path: '',
                    component: DashboardComponent
                }
            ]
        },
        {
            path: 'apostas',
            component: PagesLayoutComponent,
            children: [
                {
                    path: '',
                    component: ApostaComponent
                }
            ]
        },
        {
            path: 'cartoes',
            component: PagesLayoutComponent,
            children: [
                {
                    path: '',
                    component: CartaoComponent
                }
            ]
        },
        {
            path: 'solicitacoes-saque',
            component: PagesLayoutComponent,
            children: [
                {
                    path: '',
                    component: SolicitacaoSaqueComponent
                }
            ]
        },
        {
            path: 'tabela',
            component: PagesLayoutComponent,
            children: [
                {
                    path: '',
                    component: TabelaComponent
                }
            ]
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CambistasRoutingModule {
}

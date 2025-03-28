import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PagesLayoutComponent} from '../shared/layout/app-layouts';
import { IndiqueGanheGuard } from './../services';
import { AccountVerificationGuard } from '../shared/services/guards/account-verification.guard';
import { TermsAcceptGuard } from '../shared/services/guards/terms-accept.guard';

const routes: Routes = [{
    path: '',
    component: PagesLayoutComponent,
    children: [
        {
            path: '',
            redirectTo: 'perfil',
            pathMatch: 'full'
        },
        {
            path: 'perfil',
            loadChildren: () => import('./perfil/cliente-perfil.module').then(p => p.ClientePerfilModule)
        },
        {
            path: 'configuracoes',
            canActivate: [TermsAcceptGuard, AccountVerificationGuard],
            loadChildren: () => import('./configuracoes/configuracoes.module').then(f => f.ConfiguracoesModule)
        },
        {
            path: 'financeiro',
            canActivate: [TermsAcceptGuard, AccountVerificationGuard],
            loadChildren: () => import('./financeiro/financeiro.module').then(f => f.FinanceiroModule)
        },
        {
            path: 'carteira',
            canActivate: [TermsAcceptGuard, AccountVerificationGuard],

            loadChildren: () => import('./carteira/carteira.module').then(f => f.Carteira)
        },
        {
            path: 'apostas',
            canActivate: [TermsAcceptGuard, AccountVerificationGuard],
            loadChildren: () => import('./apostas-cliente/apostas-cliente.module').then(a => a.ApostasClienteModule)
        },
        {
            path: 'deposito',
            canActivate: [TermsAcceptGuard, AccountVerificationGuard],
            loadChildren: () => import('./deposito/deposito.module').then(a => a.DepositoModule)
        },
        {
            path: 'saque',
            canActivate: [TermsAcceptGuard, AccountVerificationGuard],
            loadChildren: () => import('./solicitacao-saque-cliente/solicitacao-saque-cliente.module')
                .then(s => s.SolicitacaoSaqueClienteModule)
        },
        {
            path: 'transacoes-historico',
            canActivate: [TermsAcceptGuard, AccountVerificationGuard],
            loadChildren: () => import('./transacoes-historico/transacoes-historico.module').then(h => h.TransacoesHistoricoModule)
        },
        {
            path: 'depositos-saques',
            canActivate: [TermsAcceptGuard, AccountVerificationGuard],
            loadChildren: () => import('./depositos-saques/depositos-saques.module').then(m => m.DepositosSaquesModule)
        },
        {
            path: 'rollover',
            canActivate: [TermsAcceptGuard, AccountVerificationGuard],
            loadChildren: () => import('./promocao/promocao.module').then(p => p.PromocaoModule)
        },
        {
            path: 'indique-ganhe',
            loadChildren: () => import('./indique-ganhe/indique-ganhe.module').then(i => i.IndiqueGanheModule),
            canActivate: [IndiqueGanheGuard, TermsAcceptGuard, AccountVerificationGuard]
        },
        {
            path: 'cashback',
            canActivate: [TermsAcceptGuard, AccountVerificationGuard],
            loadChildren: () => import('./cashback/cashback.module').then(i => i.CashbackModule)
        },
        {
            path: 'rodada-gratis',
            canActivate: [TermsAcceptGuard, AccountVerificationGuard],
            loadChildren: () => import('./promocao/promocao.module').then(p => p.PromocaoModule)
        },
        {
            path: 'personal-data',
            loadChildren: () => import('./personal-data/personal-data.module').then(p => p.PersonalDataModule)
        },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientesRoutingModule {
}

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PagesLayoutComponent} from '../shared/layout/app-layouts';
import { IndiqueGanheGuard } from './../services';

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
            path: 'perfil-pix',
            loadChildren: () => import('./perfil-pix/perfil-pix.module').then(p => p.PerfilPixModule)
        },
        {
            path: 'configuracoes',
            loadChildren: () => import('./configuracoes/configuracoes.module').then(f => f.ConfiguracoesModule)
        },
        {
            path: 'financeiro',
            loadChildren: () => import('./financeiro/financeiro.module').then(f => f.FinanceiroModule)
        },
        {
            path: 'apostas',
            loadChildren: () => import('./apostas-cliente/apostas-cliente.module').then(a => a.ApostasClienteModule)
        },
        {
            path: 'deposito',
            loadChildren: () => import('./deposito/deposito.module').then(a => a.DepositoModule)
        },
        {
            path: 'saque',
            loadChildren: () => import('./solicitacao-saque-cliente/solicitacao-saque-cliente.module')
                .then(s => s.SolicitacaoSaqueClienteModule)
        },
        {
            path: 'depositos-saques',
            loadChildren: () => import('./depositos-saques/depositos-saques.module').then(m => m.DepositosSaquesModule)
        },
        {
            path: 'rollover',
            loadChildren: () => import('./promocao/promocao.module').then(p => p.PromocaoModule)
        },
        {
            path: 'indique-ganhe',
            loadChildren: () => import('./indique-ganhe/indique-ganhe.module').then(i => i.IndiqueGanheModule),
            canActivate: [IndiqueGanheGuard]
        },
        {
            path: 'rodada-gratis',
            loadChildren: () => import('./promocao/promocao.module').then(p => p.PromocaoModule)
        },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientesRoutingModule {
}

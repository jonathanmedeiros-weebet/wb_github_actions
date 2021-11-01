import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ClientesComponent} from './clientes.component';

const routes: Routes = [{
    path: '',
    component: ClientesComponent,
    children: [
        {
            path: '',
            redirectTo: 'perfil',
            pathMatch: 'full'
        },
        {
            path: 'perfil',
            loadChildren: () => import('./perfil-cliente/perfil-cliente.module').then(p => p.PerfilClienteModule)
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
            path: 'recarga',
            loadChildren: () => import('./solicitacao-recarga/solicitacao-recarga.module').then(a => a.SolicitacaoRecargaModule)
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientesRoutingModule {
}

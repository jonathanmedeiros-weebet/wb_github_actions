import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [{
    path: '',
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
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientesRoutingModule {
}

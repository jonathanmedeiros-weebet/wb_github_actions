import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ApuracaoComponent} from './apuracao/apuracao.component';
import {PagesLayoutComponent} from '../shared/layout/app-layouts';

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
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CambistasRoutingModule {
}

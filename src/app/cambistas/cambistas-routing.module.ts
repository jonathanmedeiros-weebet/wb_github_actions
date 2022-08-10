import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [{
    path: '',
    children: [
        {
            path: 'deposito',
            loadChildren: () => import('./deposito/deposito.module').then(a => a.DepositoModule)
        },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CambistasRoutingModule {
}

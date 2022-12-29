import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DepositoCambistaComponent} from './deposito-cambista.component';

const routes: Routes = [
    {
        path: '',
        component: DepositoCambistaComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DepositoRoutingModule {
}

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DepositoComponent} from './deposito.component';

const routes: Routes = [
    {
        path: '',
        component: DepositoComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DepositoRoutingModule {
}

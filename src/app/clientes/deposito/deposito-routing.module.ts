import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DepositoComponent} from './deposito.component';
import { DepositoOpenModalComponent } from './deposito-open-modal.component';

const routes: Routes = [
    {
        path: '',
        component: window.innerWidth < 1024 ? DepositoOpenModalComponent : DepositoComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DepositoRoutingModule {
}

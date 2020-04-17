import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DepositoComponent } from './deposito/deposito.component';

const routes: Routes = [{ path: 'deposito', component: DepositoComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InformacoesRoutingModule { }

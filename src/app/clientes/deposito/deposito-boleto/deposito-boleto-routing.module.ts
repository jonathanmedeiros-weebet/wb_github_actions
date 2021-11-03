import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DepositoBoletoComponent} from './deposito-boleto.component';

const routes: Routes = [
    {
        path: '',
        component: DepositoBoletoComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepositoBoletoRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DepositoCartaoComponent} from './deposito-cartao.component';

const routes: Routes = [
    {
        path: '',
        component: DepositoCartaoComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepositoCartaoRoutingModule { }

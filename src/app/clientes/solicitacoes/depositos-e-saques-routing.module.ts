import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DepositosESaquesComponent} from './depositos-e-saques.component';

const routes: Routes = [
    {
        path: '',
        component: DepositosESaquesComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepositosESaquesRoutingModule { }

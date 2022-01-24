import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DepositosSaquesComponent} from './depositos-saques.component';

const routes: Routes = [
    {
        path: '',
        component: DepositosSaquesComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepositosSaquesRoutingModule { }

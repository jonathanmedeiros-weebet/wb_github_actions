import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FinanceiroComponent} from './financeiro.component';

const routes: Routes = [
    {
        path: '',
        component: FinanceiroComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceiroRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ApostasClienteComponent} from './apostas-cliente.component';

const routes: Routes = [
    {
        path: '',
        component: ApostasClienteComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApostasClienteRoutingModule { }

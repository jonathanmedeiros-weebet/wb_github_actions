import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SolicitacaoSaqueClienteComponent} from './solicitacao-saque-cliente.component';

const routes: Routes = [
    {
        path: '',
        component: SolicitacaoSaqueClienteComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitacaoSaqueClienteRoutingModule { }

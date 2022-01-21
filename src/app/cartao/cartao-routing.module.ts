import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitacoesSaqueComponent } from './solicitacoes-saque/solicitacoes-saque.component';
import { CartaoListagemComponent } from './cartao-listagem/cartao-listagem.component';

export const routes: Routes = [
    { path: '', component: CartaoListagemComponent },
    { path: 'solicitacoes-saque-cartao', component: SolicitacoesSaqueComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CartaoRoutingModule { }

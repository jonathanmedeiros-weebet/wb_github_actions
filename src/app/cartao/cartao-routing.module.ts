import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartaoSolicitacoesSaqueComponent } from './solicitacoes-saque/cartao-solicitacoes-saque.component';
import { CartaoListagemComponent } from './cartao-listagem/cartao-listagem.component';

export const routes: Routes = [
    { path: '', component: CartaoListagemComponent },
    { path: 'solicitacoes-saque', component: CartaoSolicitacoesSaqueComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CartaoRoutingModule { }

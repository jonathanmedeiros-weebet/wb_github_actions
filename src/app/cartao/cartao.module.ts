import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartaoRoutingModule } from './cartao-routing.module';
import { SolicitacoesSaqueComponent } from './solicitacoes-saque/solicitacoes-saque.component';
import { SharedModule } from '../shared/shared.module';
import { CartaoListagemComponent } from './cartao-listagem/cartao-listagem.component';

@NgModule({
    imports: [
        CartaoRoutingModule,
        SharedModule
    ],
    declarations: [
        SolicitacoesSaqueComponent,
        CartaoListagemComponent
    ],
})
export class CartaoModule { }

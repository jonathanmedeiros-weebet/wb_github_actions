import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SolicitacaoSaqueClienteRoutingModule} from './solicitacao-saque-cliente-routing.module';
import {SolicitacaoSaqueClienteComponent} from './solicitacao-saque-cliente.component';
import {SharedModule} from '../../shared/shared.module';
import {NgxCurrencyModule} from 'ngx-currency';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    declarations: [SolicitacaoSaqueClienteComponent],
    imports: [
        SharedModule,
        CommonModule,
        SolicitacaoSaqueClienteRoutingModule,
        NgxCurrencyModule,
        NgbModule,
    ],
})
export class SolicitacaoSaqueClienteModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SolicitacaoSaqueClienteRoutingModule } from './solicitacao-saque-cliente-routing.module';
import { SolicitacaoSaqueClienteComponent } from './solicitacao-saque-cliente.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxCurrencyDirective } from 'ngx-currency';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';


@NgModule({
    declarations: [SolicitacaoSaqueClienteComponent],
    imports: [
        SharedModule,
        CommonModule,
        SolicitacaoSaqueClienteRoutingModule,
        NgxCurrencyDirective,
        NgbModule,
        NgxMaskDirective,
        NgxMaskPipe
    ],
    providers: [provideNgxMask()]
})
export class SolicitacaoSaqueClienteModule {
}

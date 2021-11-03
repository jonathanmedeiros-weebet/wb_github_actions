import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DepositoRoutingModule} from './deposito-routing.module';
import {DepositoPixComponent} from './deposito-pix/deposito-pix.component';
import {SharedModule} from '../../shared/shared.module';
import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {DepositoComponent} from './deposito.component';
import { DepositoBoletoComponent } from './deposito-boleto/deposito-boleto.component';
import { DepositoCartaoComponent } from './deposito-cartao/deposito-cartao.component';


@NgModule({
    declarations: [
        DepositoComponent,
        DepositoPixComponent,
        DepositoBoletoComponent,
        DepositoCartaoComponent
    ],
    imports: [
        SharedModule,
        CommonModule,
        DepositoRoutingModule,
        NgbNavModule
    ]
})
export class DepositoModule {
}

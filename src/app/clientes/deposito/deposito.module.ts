import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DepositoRoutingModule} from './deposito-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {DepositoComponent} from './deposito.component';
import {DepositoPixComponent} from "./pix/deposito-pix.component";
import {DepositoWhatsappComponent} from "./whatsapp/deposito-whatsapp.component";
import {NgxCurrencyModule} from "ngx-currency";


@NgModule({
    declarations: [DepositoComponent, DepositoPixComponent, DepositoWhatsappComponent],
    imports: [
        SharedModule,
        CommonModule,
        DepositoRoutingModule,
        NgxCurrencyModule
    ]
})
export class DepositoModule {
}

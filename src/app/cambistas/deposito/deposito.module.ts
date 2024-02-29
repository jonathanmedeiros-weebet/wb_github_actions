import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DepositoRoutingModule} from './deposito-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {DepositoCambistaComponent} from './deposito-cambista.component';
import {DepositoPixComponent} from './pix/deposito-pix.component';
import {NgxCurrencyModule} from 'ngx-currency';
import {ClipboardModule} from 'ngx-clipboard';
import {NgbdModalContent} from './pix/deposito-pix.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';


@NgModule({
    declarations: [DepositoCambistaComponent, DepositoPixComponent, NgbdModalContent],
    imports: [
        SharedModule,
        CommonModule,
        DepositoRoutingModule,
        NgxCurrencyModule,
        ClipboardModule,
        NgxQRCodeModule
    ]
})
export class DepositoModule {
}

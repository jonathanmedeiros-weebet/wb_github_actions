import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DepositoRoutingModule} from './deposito-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {DepositoComponent} from './deposito.component';
import {DepositoPixComponent, NgbdModalContent} from './pix/deposito-pix.component';
import {DepositoWhatsappComponent} from './whatsapp/deposito-whatsapp.component';
import {NgxCurrencyModule} from 'ngx-currency';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';


@NgModule({
    declarations: [
        DepositoComponent,
        DepositoPixComponent,
        DepositoWhatsappComponent,
        NgbdModalContent
    ],
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

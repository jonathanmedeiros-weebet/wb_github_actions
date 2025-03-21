import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DepositoRoutingModule} from './deposito-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {DepositoComponent} from './deposito.component';
import {DepositoPixComponent, NgbdModalContent} from './pix/deposito-pix.component';
import {DepositoWhatsappComponent} from './whatsapp/deposito-whatsapp.component';
import {NgxCurrencyModule} from 'ngx-currency';
import { ClipboardModule } from 'ngx-clipboard';
import { DepositoOpenModalComponent } from './deposito-open-modal.component';
import { QrCodeModule } from 'ng-qrcode';


@NgModule({
    declarations: [
        DepositoComponent,
        DepositoPixComponent,
        DepositoWhatsappComponent,
        NgbdModalContent,
        DepositoOpenModalComponent
    ],
    imports: [
        SharedModule,
        CommonModule,
        DepositoRoutingModule,
        NgxCurrencyModule,
        ClipboardModule,
        QrCodeModule
    ]
})
export class DepositoModule {
}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DepositoWhatsappRoutingModule} from './deposito-whatsapp-routing.module';
import {DepositoWhatsappComponent} from './deposito-whatsapp.component';


@NgModule({
    declarations: [DepositoWhatsappComponent],
    imports: [
        CommonModule,
        DepositoWhatsappRoutingModule
    ]
})
export class DepositoWhatsappModule {
}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DepositoPixRoutingModule} from './deposito-pix-routing.module';
import {DepositoPixFormComponent} from './form/deposito-pix-form.component';
import {DepositoPixResultComponent} from './result/deposito-pix-result.component';
import {SharedModule} from '../../../shared/shared.module';
import {NgxCurrencyModule} from 'ngx-currency';

@NgModule({
    declarations: [DepositoPixFormComponent, DepositoPixResultComponent],
    imports: [
        SharedModule,
        CommonModule,
        DepositoPixRoutingModule,
        NgxCurrencyModule
    ]
})
export class DepositoPixModule {
}

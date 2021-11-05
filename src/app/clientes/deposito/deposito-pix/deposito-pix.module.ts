import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DepositoPixRoutingModule} from './deposito-pix-routing.module';
import {PixFormComponent} from './pix-form/pix-form.component';
import {PixResultComponent} from './pix-result/pix-result.component';
import {SharedModule} from '../../../shared/shared.module';
import {NgxCurrencyModule} from 'ngx-currency';

@NgModule({
    declarations: [PixFormComponent, PixResultComponent],
    imports: [
        SharedModule,
        CommonModule,
        DepositoPixRoutingModule,
        NgxCurrencyModule
    ]
})
export class DepositoPixModule {
}

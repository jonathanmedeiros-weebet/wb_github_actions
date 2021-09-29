import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FinanceiroRoutingModule} from './financeiro-routing.module';
import {FinanceiroComponent} from './financeiro.component';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
    declarations: [FinanceiroComponent],
    imports: [
        SharedModule,
        CommonModule,
        FinanceiroRoutingModule
    ]
})
export class FinanceiroModule {
}

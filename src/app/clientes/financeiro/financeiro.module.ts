import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FinanceiroRoutingModule} from './financeiro-routing.module';
import {FinanceiroComponent} from './financeiro.component';
import {SharedModule} from '../../shared/shared.module';
import {NgxChartsModule} from '@swimlane/ngx-charts';


@NgModule({
    declarations: [FinanceiroComponent],
    imports: [
        SharedModule,
        CommonModule,
        FinanceiroRoutingModule,
        NgxChartsModule
    ]
})
export class FinanceiroModule {
}

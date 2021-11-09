import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DepositosESaquesRoutingModule} from './depositos-e-saques-routing.module';
import {DepositosESaquesComponent} from './depositos-e-saques.component';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
    declarations: [DepositosESaquesComponent],
    imports: [
        SharedModule,
        CommonModule,
        DepositosESaquesRoutingModule
    ]
})
export class DepositosESaquesModule {
}

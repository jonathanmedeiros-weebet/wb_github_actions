import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DepositosSaquesRoutingModule} from './depositos-saques-routing.module';
import {DepositosSaquesComponent} from './depositos-saques.component';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
    declarations: [DepositosSaquesComponent],
    imports: [
        SharedModule,
        CommonModule,
        DepositosSaquesRoutingModule
    ]
})
export class DepositosSaquesModule {
}

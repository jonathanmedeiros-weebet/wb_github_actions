import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DepositoRoutingModule} from './deposito-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {DepositoComponent} from './deposito.component';


@NgModule({
    declarations: [DepositoComponent],
    imports: [
        SharedModule,
        CommonModule,
        DepositoRoutingModule,
    ]
})
export class DepositoModule {
}

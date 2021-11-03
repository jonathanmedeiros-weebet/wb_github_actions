import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DepositoPixRoutingModule} from './deposito-pix-routing.module';
import {DepositoPixComponent} from './deposito-pix.component';
import { PixFormComponent } from './pix-form/pix-form.component';
import { PixResultComponent } from './pix-result/pix-result.component';
import {SharedModule} from '../../../shared/shared.module';

@NgModule({
    declarations: [DepositoPixComponent, PixFormComponent, PixResultComponent],
    imports: [
        SharedModule,
        CommonModule,
        DepositoPixRoutingModule
    ]
})
export class DepositoPixModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CashbackRoutingModule } from './cashback-routing.module';
import { CashbackComponent } from './cashback.component';

@NgModule({
    declarations: [CashbackComponent],
    imports: [
        CommonModule,
        CashbackRoutingModule,
        SharedModule,
        NgbModule,
        NgbTooltipModule
    ],
    providers: []
})
export class CashbackModule { }

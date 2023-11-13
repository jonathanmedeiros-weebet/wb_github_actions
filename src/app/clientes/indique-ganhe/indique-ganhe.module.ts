import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { IndiqueGanheRoutingModule } from './indique-ganhe-routing.module';
import { IndiqueGanheComponent } from './indique-ganhe.component';
import { IndiqueGanheService } from 'src/app/shared/services/clientes/indique-ganhe.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [IndiqueGanheComponent],
    imports: [
        CommonModule,
        IndiqueGanheRoutingModule,
        SharedModule,
        NgbModule,
        NgbTooltipModule
    ],
    providers: [
        IndiqueGanheService
    ]
})
export class IndiqueGanheModule { }

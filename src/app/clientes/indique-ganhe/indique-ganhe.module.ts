import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndiqueGanheRoutingModule } from './indique-ganhe-routing.module';
import { IndiqueGanheComponent } from './indique-ganhe.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    declarations: [IndiqueGanheComponent],
    imports: [
        CommonModule,
        IndiqueGanheRoutingModule,
        SharedModule
    ]
})
export class IndiqueGanheModule { }

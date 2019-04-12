import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BilheteComponent } from './bilhete.component';
import { LayoutModule } from '../shared/layout/layout.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,

        LayoutModule
    ],
    declarations: [
        BilheteComponent
    ]
})
export class BilheteModule { }

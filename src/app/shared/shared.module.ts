import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ErrorMsgComponent } from './error-msg/error-msg.component';
import { LayoutModule } from './layout/layout.module';
import { UtilsModule } from './utils/utils.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule
    ],
    declarations: [ErrorMsgComponent],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,

        LayoutModule,
        UtilsModule,
        ErrorMsgComponent
    ]
})
export class SharedModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LayoutModule } from './layout/layout.module';
import { UtilsModule } from './utils/utils.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    declarations: [],
    imports: [],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        LayoutModule,
        UtilsModule,
        TranslateModule
    ]
})
export class SharedModule { }

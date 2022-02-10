import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LayoutModule } from './layout/layout.module';
import { UtilsModule } from './utils/utils.module';
import { DefaultImageDirective } from './directives/default-image.directive';

@NgModule({
    declarations: [
    DefaultImageDirective
  ],
    imports: [],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,

        LayoutModule,
        UtilsModule,
        DefaultImageDirective
    ]
})
export class SharedModule { }

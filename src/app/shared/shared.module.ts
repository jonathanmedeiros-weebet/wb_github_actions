import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LayoutModule } from './layout/layout.module';
import { UtilsModule } from './utils/utils.module';

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule],
  declarations: [],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    LayoutModule,
    UtilsModule
  ]
})
export class SharedModule {}

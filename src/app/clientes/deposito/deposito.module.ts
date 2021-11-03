import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepositoRoutingModule } from './deposito-routing.module';
import { DepositoPixComponent } from './deposito-pix/deposito-pix.component';


@NgModule({
  declarations: [DepositoPixComponent],
  imports: [
    CommonModule,
    DepositoRoutingModule
  ]
})
export class DepositoModule { }

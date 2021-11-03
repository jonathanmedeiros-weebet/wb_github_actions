import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepositoBoletoRoutingModule } from './deposito-boleto-routing.module';
import {DepositoBoletoComponent} from './deposito-boleto.component';


@NgModule({
  declarations: [DepositoBoletoComponent],
  imports: [
    CommonModule,
    DepositoBoletoRoutingModule
  ]
})
export class DepositoBoletoModule { }

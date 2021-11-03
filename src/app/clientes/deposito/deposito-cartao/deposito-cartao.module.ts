import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepositoCartaoRoutingModule } from './deposito-cartao-routing.module';
import {DepositoCartaoComponent} from './deposito-cartao.component';


@NgModule({
  declarations: [DepositoCartaoComponent],
  imports: [
    CommonModule,
    DepositoCartaoRoutingModule
  ]
})
export class DepositoCartaoModule { }

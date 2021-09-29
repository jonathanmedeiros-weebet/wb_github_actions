import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApostasClienteRoutingModule } from './apostas-cliente-routing.module';
import {ApostasClienteComponent} from './apostas-cliente.component';


@NgModule({
  declarations: [ApostasClienteComponent],
  imports: [
    CommonModule,
    ApostasClienteRoutingModule
  ]
})
export class ApostasClienteModule { }

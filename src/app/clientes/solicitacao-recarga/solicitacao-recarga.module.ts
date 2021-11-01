import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SolicitacaoRecargaRoutingModule } from './solicitacao-recarga-routing.module';
import {SolicitacaoRecargaComponent} from './solicitacao-recarga.component';


@NgModule({
  declarations: [
      SolicitacaoRecargaComponent
  ],
  imports: [
    CommonModule,
    SolicitacaoRecargaRoutingModule
  ]
})
export class SolicitacaoRecargaModule { }

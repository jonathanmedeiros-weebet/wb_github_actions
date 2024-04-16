import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransacoesHistoricoRoutingModule } from './transacoes-historico-routing.module';
import { TransacoesHistoricoComponent } from './transacoes-historico.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    TransacoesHistoricoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TransacoesHistoricoRoutingModule,
    NgbModule
  ]
})
export class TransacoesHistoricoModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { InformacoesRoutingModule } from './informacoes-routing.module';
import { DepositoComponent } from './deposito/deposito.component';
import { PaginaService } from './../services';

@NgModule({
    declarations: [DepositoComponent],
    imports: [CommonModule, InformacoesRoutingModule],
    providers: [PaginaService]
})
export class InformacoesModule { }

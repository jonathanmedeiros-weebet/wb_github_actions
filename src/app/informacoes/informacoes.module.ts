import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UtilsModule } from './../shared/utils/utils.module';
import { InformacoesRoutingModule } from './informacoes-routing.module';
import { InformacoesComponent } from './informacoes.component';
import { PaginaService } from './../services';

@NgModule({
    declarations: [InformacoesComponent],
    imports: [CommonModule, UtilsModule, InformacoesRoutingModule],
    providers: [PaginaService]
})
export class InformacoesModule { }

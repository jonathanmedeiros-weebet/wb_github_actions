// import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { InformacoesRoutingModule } from './informacoes-routing.module';
import { InformacoesComponent } from './informacoes.component';
import { PaginaService } from './../services';

@NgModule({
    declarations: [InformacoesComponent],
    imports: [SharedModule, InformacoesRoutingModule],
    providers: [PaginaService]
})
export class InformacoesModule { }

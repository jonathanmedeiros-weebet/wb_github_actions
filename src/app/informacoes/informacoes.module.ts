import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';

import { InformacoesRoutingModule } from './informacoes-routing.module';
import { InformacoesComponent } from './informacoes.component';
import { PaginaService } from './../services';

import {NgxPrintModule} from 'ngx-print';

@NgModule({
    declarations: [InformacoesComponent],
    imports: [SharedModule, InformacoesRoutingModule, NgxPrintModule],
    providers: [PaginaService]
})
export class InformacoesModule { }

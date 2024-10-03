import { NgModule } from '@angular/core';

import { CupomComponent } from './cupom.component';
import { SharedModule } from '../shared/shared.module';
import { StatsService, ResultadoService } from '../services';
import { CupomAcumuladaoComponent } from './acumuladao/cupom-acumuladao.component';
import { CupomDesafioComponent } from './desafio/cupom-desafio.component';
import { CupomEsportesComponent } from './esportes/cupom-esportes.component';
import { CompartilharBilheteComponent } from './compartilhar-bilhete/compartilhar-bilhete.component';

@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        CupomComponent,
        CupomAcumuladaoComponent,
        CupomDesafioComponent,
        CupomEsportesComponent,
        CompartilharBilheteComponent
    ],
    providers: [StatsService, ResultadoService]
})
export class CupomModule { }

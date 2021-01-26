import { NgModule } from '@angular/core';

import { CupomComponent } from './cupom.component';
import { SharedModule } from '../shared/shared.module';
import { StatsService, ResultadoService } from '../services';
import { CupomEsportesComponent } from './esportes/cupom-esportes.component';
import { CupomAcumuladaoComponent } from './acumuladao/cupom-acumuladao.component';

@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        CupomComponent,
        CupomEsportesComponent,
        CupomAcumuladaoComponent
    ],
    providers: [StatsService, ResultadoService]
})
export class CupomModule { }

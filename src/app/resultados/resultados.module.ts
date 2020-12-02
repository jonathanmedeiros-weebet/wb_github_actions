import { NgModule } from '@angular/core';

import { ResultadosEsporteComponent } from './esportes/resultados-esporte.component';
import { SharedModule } from '../shared/shared.module';
import { ResultadosRoutingModule } from './resultados-routing.module';
import { ResultadosLoteriasComponent } from './loterias/resultados-loterias.component';
import { ResultadoService } from './../services';

@NgModule({
    imports: [SharedModule, ResultadosRoutingModule],
    exports: [],
    declarations: [ResultadosEsporteComponent, ResultadosLoteriasComponent],
    providers: [ResultadoService],
})
export class ResultadosModule { }

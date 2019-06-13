import { NgModule } from '@angular/core';

import { ResultadosEsporteComponent } from './esportes/resultados-esporte.component';
import { SharedModule } from '../shared/shared.module';
import { ResultadosRoutingModule } from './resultados-routing.module';
import { ResultadosLoteriasComponent } from './loterias/resultados-loterias.component';

@NgModule({
    imports: [SharedModule, ResultadosRoutingModule],
    exports: [],
    declarations: [ResultadosEsporteComponent, ResultadosLoteriasComponent],
    providers: [],
})
export class ResultadosModule { }

import { NgModule } from '@angular/core';

import { ResultadosEsporteComponent } from './esportes/resultados-esporte.component';
import { SharedModule } from '../shared/shared.module';
import { ResultadosRoutingModule } from './resultados-routing.module';

@NgModule({
    imports: [SharedModule, ResultadosRoutingModule],
    exports: [],
    declarations: [ResultadosEsporteComponent],
    providers: [],
})
export class ResultadosModule { }

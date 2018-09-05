import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { ResultadosEsporteRoutingModule } from './resultados-esporte-routing.module';
import { ResultadosEsporteComponent } from './resultados-esporte.component';
import { CampeonatoService } from './../../services';

@NgModule({
    imports: [SharedModule, ResultadosEsporteRoutingModule],
    declarations: [ResultadosEsporteComponent],
    providers: [CampeonatoService]
})
export class ResultadosEsporteModule { }

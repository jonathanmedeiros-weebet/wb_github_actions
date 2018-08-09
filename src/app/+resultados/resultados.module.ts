import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { ResultadosRoutingModule } from './resultados-routing.module';
import { ResultadosLoteriaComponent } from './loteria/resultados-loteria.component';
import { ResultadosFutebolComponent } from './futebol/resultados-futebol.component';
import { SorteioService } from './../services';

@NgModule({
    imports: [SharedModule, ResultadosRoutingModule],
    declarations: [ResultadosFutebolComponent, ResultadosLoteriaComponent],
    providers: [SorteioService]
})
export class ResultadosModule { }

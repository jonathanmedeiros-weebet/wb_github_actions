import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { ResultadosLoteriaComponent } from './resultados-loteria.component';
import { SorteioService } from './../../services';
import { ResultadosLoteriaRoutingModule } from './resultados-loteria-routing.module';

@NgModule({
    imports: [SharedModule, ResultadosLoteriaRoutingModule],
    declarations: [ResultadosLoteriaComponent],
    providers: [SorteioService]
})
export class ResultadosLoteriaModule { }

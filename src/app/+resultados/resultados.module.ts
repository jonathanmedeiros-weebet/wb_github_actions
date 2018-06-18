import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { ResultadosRoutingModule } from './resultados-routing.module';
import { ResultadosComponent } from './resultados.component';
import { SorteioService } from './../services';

@NgModule({
    imports: [SharedModule, ResultadosRoutingModule],
    declarations: [ResultadosComponent],
    providers: [SorteioService]
})
export class ResultadosModule { }

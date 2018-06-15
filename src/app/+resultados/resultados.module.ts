import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { ResultadosRoutingModule } from './resultados-routing.module';
import { ResultadosComponent } from './resultados.component';

@NgModule({
    imports: [SharedModule, ResultadosRoutingModule],
    declarations: [ResultadosComponent],
    providers: []
})
export class ResultadosModule { }

import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { ValidarApostaRoutingModule } from './validar-aposta-routing.module';
import { ValidarApostaComponent } from './validar-aposta.component';
import { ApostaEsportivaService } from '../services';

@NgModule({
    imports: [SharedModule, ValidarApostaRoutingModule],
    declarations: [ValidarApostaComponent],
    providers: [ApostaEsportivaService]
})
export class ValidarApostaModule { }

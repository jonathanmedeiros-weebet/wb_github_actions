import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { ConsultarApostaRoutingModule } from './consultar-aposta-routing.module';
import { ConsultarApostaComponent } from './consultar-aposta.component';
import { ApostaEsportivaService } from '../../services';

@NgModule({
    imports: [SharedModule, ConsultarApostaRoutingModule],
    declarations: [ConsultarApostaComponent],
    providers: [ApostaEsportivaService]
})
export class ConsultarApostaModule { }

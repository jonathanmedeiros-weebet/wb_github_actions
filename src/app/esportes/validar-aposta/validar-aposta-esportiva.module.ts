import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { ApostaEsportivaService } from '../../services';
import { ValidarApostaEsportivaComponent } from './validar-aposta-esportiva.component';
import { ValidarApostaEsportivaRoutingModule } from './validar-aposta-esportiva-routing.module';

@NgModule({
    imports: [SharedModule, ValidarApostaEsportivaRoutingModule],
    declarations: [ValidarApostaEsportivaComponent],
    providers: [ApostaEsportivaService]
})
export class ValidarApostaEsportivaModule { }

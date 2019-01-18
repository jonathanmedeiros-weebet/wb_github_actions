import { NgModule } from '@angular/core';

import { ValidarApostaComponent } from './validar-aposta.component';
import { SharedModule } from '../shared/shared.module';
import { ValidarApostaRoutingModule } from './validar-aposta-routing.module';
import { PreApostaEsportivaService, ApostaEsportivaService, ApostaLoteriaService, SorteioService } from '../services';

@NgModule({
    imports: [SharedModule, ValidarApostaRoutingModule],
    exports: [],
    declarations: [ValidarApostaComponent],
    providers: [PreApostaEsportivaService, ApostaEsportivaService, ApostaLoteriaService, SorteioService]
})
export class ValidarApostaModule { }

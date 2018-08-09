import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { ApuracaoRoutingModule } from './apuracao-routing.module';
import { ApuracaoFutebolComponent } from './futebol/apuracao-futebol.component';
import { ApuracaoLoteriaComponent } from './loteria/apuracao-loteria.component';
import { ApostaService, SorteioService, ApostaEsportivaService } from './../services';

@NgModule({
    imports: [SharedModule, ApuracaoRoutingModule],
    declarations: [ApuracaoLoteriaComponent, ApuracaoFutebolComponent],
    providers: [ApostaService, ApostaEsportivaService, SorteioService]
})
export class ApuracaoModule { }

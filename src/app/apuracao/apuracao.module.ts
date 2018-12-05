import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ApuracaoRoutingModule } from './apuracao-routing.module';
import { SorteioService, ApostaLoteriaService, ApostaEsportivaService } from '../services';
import { ApuracaoLoteriaComponent } from './loteria/apuracao-loteria.component';
import { ApuracaoEsporteComponent } from './esportes/apuracao-esporte.component';

@NgModule({
    imports: [SharedModule, ApuracaoRoutingModule],
    exports: [],
    declarations: [ApuracaoEsporteComponent, ApuracaoLoteriaComponent],
    providers: [SorteioService, ApostaLoteriaService, ApostaEsportivaService],
})
export class ApuracaoModule { }

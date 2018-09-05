import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { ApuracaoEsporteRoutingModule } from './apuracao-esporte-routing.module';
import { ApuracaoEsporteComponent } from './apuracao-esporte.component';
import { ApostaEsportivaService } from './../../services';

@NgModule({
    imports: [SharedModule, ApuracaoEsporteRoutingModule],
    declarations: [ApuracaoEsporteComponent],
    providers: [ApostaEsportivaService]
})
export class ApuracaoEsporteModule { }

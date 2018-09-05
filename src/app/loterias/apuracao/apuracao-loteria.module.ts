import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { ApuracaoLoteriaRoutingModule } from './apuracao-loteria-routing.module';
import { ApuracaoLoteriaComponent } from './apuracao-loteria.component';
import { ApostaService, SorteioService } from './../../services';

@NgModule({
    imports: [SharedModule, ApuracaoLoteriaRoutingModule],
    declarations: [ApuracaoLoteriaComponent],
    providers: [ApostaService, SorteioService]
})
export class ApuracaoLoteriaModule { }

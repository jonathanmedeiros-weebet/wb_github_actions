import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { ApuracaoRoutingModule } from './apuracao-routing.module';
import { ApuracaoComponent } from './apuracao.component';
import { ApostaService } from './../services';

@NgModule({
    imports: [SharedModule, ApuracaoRoutingModule],
    declarations: [ApuracaoComponent],
    providers: [ApostaService]
})
export class ApuracaoModule { }

import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { BasqueteRoutingModule } from './basquete-routing.module';
import { BasqueteWrapperComponent } from './wrapper/basquete-wrapper.component';
import { JogoService, BilheteEsportivoService, ApostaEsportivaService } from './../../services';

@NgModule({
    imports: [
        SharedModule,
        BasqueteRoutingModule
    ],
    declarations: [
        BasqueteWrapperComponent
    ],
    providers: [
        JogoService,
        BilheteEsportivoService,
        ApostaEsportivaService
    ]
})
export class BasqueteModule { }

import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { EsportesRoutingModule } from './esportes-routing.module';
import { ApostaEsportivaService, PreApostaEsportivaService } from '../services';

@NgModule({
    imports: [
        SharedModule,
        EsportesRoutingModule
    ],
    declarations: [],
    providers: [
        ApostaEsportivaService,
        PreApostaEsportivaService
    ]
})
export class EsportesModule { }

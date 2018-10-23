import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { EsportesRoutingModule } from './esportes-routing.module';
import { ApostaEsportivaService, PreApostaEsportivaService, CampeonatoService } from '../services';

@NgModule({
    imports: [
        SharedModule,
        EsportesRoutingModule
    ],
    declarations: [],
    providers: [
        ApostaEsportivaService,
        PreApostaEsportivaService,
        CampeonatoService
    ]
})
export class EsportesModule { }

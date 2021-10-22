import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { ModalidadesRoutingModule } from './modalidades-routing.module';
import { EsportesModule } from '../esportes.module';
import { JogoService, BilheteEsportivoService, ApostaEsportivaService } from '../../services';

@NgModule({
    imports: [
        SharedModule,
        EsportesModule,
        ModalidadesRoutingModule
    ],
    declarations: [],
    providers: [
        JogoService,
        BilheteEsportivoService,
        ApostaEsportivaService
    ]
})
export class ModalidadesModule { }

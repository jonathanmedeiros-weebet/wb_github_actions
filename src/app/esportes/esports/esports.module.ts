import {NgModule} from '@angular/core';

import {SharedModule} from './../../shared/shared.module';
import {EsportsRoutingModule} from './esports-routing.module';
import {EsportesModule} from './../esportes.module';
import {ApostaEsportivaService, JogoService} from './../../services';

@NgModule({
    imports: [
        SharedModule,
        EsportesModule,
        EsportsRoutingModule
    ],
    declarations: [],
    providers: [
        JogoService,
        ApostaEsportivaService
    ]
})
export class EsportsModule { }

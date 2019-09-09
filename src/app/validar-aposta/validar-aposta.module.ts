import { NgModule } from '@angular/core';

import { ValidarApostaWrapperComponent } from './wrapper/validar-aposta-wrapper.component';
import { ValidarApostaEsportesComponent } from './esportes/validar-aposta-esportes.component';
import { ValidarApostaLoteriasComponent } from './loterias/validar-aposta-loterias.component';
import { ValidarApostaAcumuladaoComponent } from './acumuladao/validar-aposta-acumuladao.component';
import { SharedModule } from '../shared/shared.module';
import { ValidarApostaRoutingModule } from './validar-aposta-routing.module';
import {
    PreApostaEsportivaService,
    ApostaEsportivaService,
    ApostaLoteriaService,
    SorteioService,
    AcumuladaoService
} from '../services';

@NgModule({
    imports: [SharedModule, ValidarApostaRoutingModule],
    exports: [],
    declarations: [
        ValidarApostaWrapperComponent,
        ValidarApostaEsportesComponent,
        ValidarApostaLoteriasComponent,
        ValidarApostaAcumuladaoComponent
    ],
    providers: [
        PreApostaEsportivaService,
        ApostaEsportivaService,
        ApostaLoteriaService,
        SorteioService,
        AcumuladaoService
    ]
})
export class ValidarApostaModule { }

import { NgModule } from '@angular/core';

import { ValidarApostaWrapperComponent } from './wrapper/validar-aposta-wrapper.component';
import { ValidarApostaEsportesComponent } from './esportes/validar-aposta-esportes.component';
import { ValidarApostaLoteriasComponent } from './loterias/validar-aposta-loterias.component';
import { ValidarApostaAcumuladaoComponent } from './acumuladao/validar-aposta-acumuladao.component';
import { ValidarApostaDesafiosComponent } from './desafios/validar-aposta-desafios.component';
import { SharedModule } from '../shared/shared.module';
import { ValidarApostaRoutingModule } from './validar-aposta-routing.module';
import {
    PreApostaEsportivaService,
    ApostaEsportivaService,
    ApostaLoteriaService,
    SorteioService,
    AcumuladaoService,
    DesafioApostaService
} from '../services';
import {NgxMaskModule} from 'ngx-mask';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [SharedModule, ValidarApostaRoutingModule, NgxMaskModule],
    exports: [],
    declarations: [
        ValidarApostaWrapperComponent,
        ValidarApostaEsportesComponent,
        ValidarApostaLoteriasComponent,
        ValidarApostaAcumuladaoComponent,
        ValidarApostaDesafiosComponent
    ],
    providers: [
        PreApostaEsportivaService,
        ApostaEsportivaService,
        ApostaLoteriaService,
        SorteioService,
        AcumuladaoService,
        DesafioApostaService,
        NgbActiveModal
    ]
})
export class ValidarApostaModule { }

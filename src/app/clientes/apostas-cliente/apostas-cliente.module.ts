import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ApostasClienteRoutingModule} from './apostas-cliente-routing.module';
import {ApostasClienteComponent} from './apostas-cliente.component';
import {SharedModule} from '../../shared/shared.module';
import {NgbModule, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {ApostasClienteEsporteComponent} from './apostas-cliente-esportes/apostas-cliente-esporte.component';
import {ApostasClienteAcumuladaoComponent} from './apostas-cliente-acumuladao/apostas-cliente-acumuladao.component';
import {AcumuladaoService} from '../../shared/services/acumuladao.service';
import {ApostasClienteDesafioComponent} from './apostas-cliente-desafio/apostas-cliente-desafio.component';
import {DesafioApostaService} from '../../shared/services/desafio/desafio-aposta.service';
import {ApostasClienteLoteriaComponent} from './apostas-cliente-loteria/apostas-cliente-loteria.component';
import {ApostaLoteriaService} from '../../shared/services/loteria/aposta-loteria.service';
import {ApostasClienteCasinoComponent} from './apostas-cliente-casino/apostas-cliente-casino.component';



@NgModule({
    declarations: [
        ApostasClienteComponent,
        ApostasClienteEsporteComponent,
        ApostasClienteAcumuladaoComponent,
        ApostasClienteDesafioComponent,
        ApostasClienteLoteriaComponent,
        ApostasClienteCasinoComponent
    ],
    imports: [
        SharedModule,
        CommonModule,
        ApostasClienteRoutingModule,
        NgbNavModule,
        NgbModule
    ],
    providers: [
        AcumuladaoService,
        DesafioApostaService,
        ApostaLoteriaService
    ]
})
export class ApostasClienteModule {
}

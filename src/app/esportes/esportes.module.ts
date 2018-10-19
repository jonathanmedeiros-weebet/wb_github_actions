import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { EsportesRoutingModule } from './esportes-routing.module';
import { ValidarApostaEsportivaComponent } from './validar-aposta/validar-aposta-esportiva.component';
import { ConsultarApostaComponent } from './consultar-aposta/consultar-aposta.component';
import { ApuracaoEsporteComponent } from './apuracao/apuracao-esporte.component';
import { ResultadosEsporteComponent } from './resultados/resultados-esporte.component';
import { ApostaEsportivaService, PreApostaEsportivaService, CampeonatoService } from '../services';

@NgModule({
    imports: [
        SharedModule,
        EsportesRoutingModule
    ],
    declarations: [
        ApuracaoEsporteComponent,
        ConsultarApostaComponent,
        ResultadosEsporteComponent,
        ValidarApostaEsportivaComponent
    ],
    providers: [
        ApostaEsportivaService,
        PreApostaEsportivaService,
        CampeonatoService
    ]
})
export class EsportesModule { }

import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { AdminEsportesRoutingModule } from './esportes-routing.module';
import { ApostaEsportivaService, PreApostaEsportivaService } from '../../services';
import { AdminApuracaoEsporteComponent } from './apuracao/apuracao-esporte.component';
import { ResultadosEsporteComponent } from './resultados/resultados-esporte.component';
import { ConsultarApostaEsporteComponent } from './consultar-aposta/consultar-aposta-esporte.component';

@NgModule({
    imports: [
        SharedModule,
        AdminEsportesRoutingModule
    ],
    declarations: [
        AdminApuracaoEsporteComponent,
        ResultadosEsporteComponent,
        ConsultarApostaEsporteComponent
    ],
    providers: [
        ApostaEsportivaService,
        PreApostaEsportivaService
    ]
})
export class AdminEsportesModule { }

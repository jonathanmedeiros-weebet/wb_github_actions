import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { EsportesRoutingModule } from './esportes-routing.module';
import { BilheteEsportivoComponent } from './bilhete/bilhete-esportivo.component';
import { EsportesFooterComponent } from './footer/esportes-footer.component';
import { EsportesWrapperComponent } from './wrapper/esportes-wrapper.component';
import { ApostaEsportivaService, PreApostaEsportivaService } from '../services';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
    imports: [
        SharedModule,
        EsportesRoutingModule,
        NgxMaskModule.forRoot(),
    ],
    declarations: [
        BilheteEsportivoComponent,
        EsportesFooterComponent,
        EsportesWrapperComponent
    ],
    exports: [
        BilheteEsportivoComponent,
        EsportesFooterComponent,
        EsportesWrapperComponent
    ],
    providers: [
        ApostaEsportivaService,
        PreApostaEsportivaService
    ]
})
export class EsportesModule { }

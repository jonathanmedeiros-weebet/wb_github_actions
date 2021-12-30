import {NgModule} from '@angular/core';

import {SharedModule} from './../shared/shared.module';
import {EsportesRoutingModule} from './esportes-routing.module';
import {EsportesFooterComponent} from './footer/esportes-footer.component';
import {EsportesWrapperComponent} from './wrapper/esportes-wrapper.component';
import {PreApostaEsportivaService} from '../services';
import {NgxMaskModule} from 'ngx-mask';
import { DestaquesComponent } from './destaques/destaques.component';

@NgModule({
    imports: [
        SharedModule,
        EsportesRoutingModule,
        NgxMaskModule.forRoot(),
    ],
    declarations: [
        EsportesFooterComponent,
        EsportesWrapperComponent,
        DestaquesComponent,
    ],
    exports: [
        EsportesFooterComponent,
        EsportesWrapperComponent,
        DestaquesComponent,
    ],
    providers: [
        PreApostaEsportivaService
    ]
})
export class EsportesModule { }

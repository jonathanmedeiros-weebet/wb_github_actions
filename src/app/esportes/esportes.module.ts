import {NgModule} from '@angular/core';

import {SharedModule} from './../shared/shared.module';
import {EsportesRoutingModule} from './esportes-routing.module';
import {EsportesFooterComponent} from './footer/esportes-footer.component';
import {EsportesWrapperComponent} from './wrapper/esportes-wrapper.component';
import {PreApostaEsportivaService} from '../services';
import {NgxMaskModule} from 'ngx-mask';
import { DestaquesComponent } from './destaques/destaques.component';
import { CampeonatoDestaqueComponent } from './campeonato-destaque/campeonato-destaque.component';

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
        CampeonatoDestaqueComponent,
    ],
    exports: [
        EsportesFooterComponent,
        EsportesWrapperComponent,
        DestaquesComponent,
        CampeonatoDestaqueComponent
    ],
    providers: [
        PreApostaEsportivaService
    ]
})
export class EsportesModule { }

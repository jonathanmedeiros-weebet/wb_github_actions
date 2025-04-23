import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { EsportesRoutingModule } from './esportes-routing.module';
import { EsportesFooterComponent } from './footer/esportes-footer.component';
import { EsportesWrapperComponent } from './wrapper/esportes-wrapper.component';
import { PreApostaEsportivaService } from '../services';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { DestaquesComponent } from './destaques/destaques.component';
import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
    imports: [
        SharedModule,
        CarouselModule,
        EsportesRoutingModule,
        NgxMaskDirective,
        NgxMaskPipe
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
        PreApostaEsportivaService,
        provideNgxMask()
    ]
})
export class EsportesModule { }

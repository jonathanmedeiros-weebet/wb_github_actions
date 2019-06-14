import { NgModule } from '@angular/core';

import {
    MomentPipe,
    TimeToStringtPipe,
    TipoApostaPipe,
    TipoApostaCombatePipe,
    CalcularCotacaoPipe,
    SorteioTipoPipe,
    InfiniteScrollDirective,
} from './index';

@NgModule({
    declarations: [
        MomentPipe,
        TimeToStringtPipe,
        TipoApostaPipe,
        TipoApostaCombatePipe,
        CalcularCotacaoPipe,
        SorteioTipoPipe,
        InfiniteScrollDirective
    ],
    exports: [
        MomentPipe,
        TimeToStringtPipe,
        TipoApostaPipe,
        TipoApostaCombatePipe,
        CalcularCotacaoPipe,
        SorteioTipoPipe,
        InfiniteScrollDirective
    ]
})
export class UtilsModule { }

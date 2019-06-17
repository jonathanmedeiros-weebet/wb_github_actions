import { NgModule } from '@angular/core';

import {
    MomentPipe,
    TimeToStringtPipe,
    TipoApostaPipe,
    TipoApostaCombatePipe,
    CalcularCotacaoPipe,
    OddCategoriaPipe,
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
        OddCategoriaPipe,
        SorteioTipoPipe,
        InfiniteScrollDirective
    ],
    exports: [
        MomentPipe,
        TimeToStringtPipe,
        TipoApostaPipe,
        TipoApostaCombatePipe,
        CalcularCotacaoPipe,
        OddCategoriaPipe,
        SorteioTipoPipe,
        InfiniteScrollDirective
    ]
})
export class UtilsModule { }

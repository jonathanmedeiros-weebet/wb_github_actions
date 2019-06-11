import { NgModule } from '@angular/core';

import {
    MomentPipe,
    TimeToStringtPipe,
    TipoApostaPipe,
    TipoApostaCombatePipe,
    CalcularCotacaoPipe,
    PerfectScrollDirective,
    OddCategoriaPipe
} from './index';

@NgModule({
    declarations: [
        MomentPipe,
        TimeToStringtPipe,
        TipoApostaPipe,
        TipoApostaCombatePipe,
        CalcularCotacaoPipe,
        OddCategoriaPipe,
        PerfectScrollDirective
    ],
    exports: [
        MomentPipe,
        TimeToStringtPipe,
        TipoApostaPipe,
        TipoApostaCombatePipe,
        CalcularCotacaoPipe,
        OddCategoriaPipe,
        PerfectScrollDirective
    ]
})
export class UtilsModule { }

import { NgModule } from '@angular/core';

import {
    MomentPipe,
    TimeToStringtPipe,
    TipoApostaPipe,
    TipoApostaCombatePipe,
    CalcularCotacaoPipe,
    PerfectScrollDirective
} from './index';

@NgModule({
    declarations: [
        MomentPipe,
        TimeToStringtPipe,
        TipoApostaPipe,
        TipoApostaCombatePipe,
        CalcularCotacaoPipe,
        PerfectScrollDirective,
    ],
    exports: [
        MomentPipe,
        TimeToStringtPipe,
        TipoApostaPipe,
        TipoApostaCombatePipe,
        CalcularCotacaoPipe,
        PerfectScrollDirective
    ]
})
export class UtilsModule { }

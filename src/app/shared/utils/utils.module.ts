import { NgModule } from '@angular/core';

import {
    MomentPipe,
    TimeToStringtPipe,
    TipoApostaPipe,
    CalcularCotacaoPipe,
    PerfectScrollDirective
} from './index';

@NgModule({
    declarations: [
        MomentPipe,
        TimeToStringtPipe,
        TipoApostaPipe,
        CalcularCotacaoPipe,
        PerfectScrollDirective,
    ],
    exports: [
        MomentPipe,
        TimeToStringtPipe,
        TipoApostaPipe,
        CalcularCotacaoPipe,
        PerfectScrollDirective
    ]
})
export class UtilsModule { }

import { NgModule } from '@angular/core';

import {
    MomentPipe,
    TimeToStringtPipe,
    TipoApostaPipe,
    TipoApostaCombatePipe,
    CalcularCotacaoPipe,
    SorteioTipoPipe,
    PerfectScrollDirective
} from './index';

@NgModule({
    declarations: [
        MomentPipe,
        TimeToStringtPipe,
        TipoApostaPipe,
        TipoApostaCombatePipe,
        CalcularCotacaoPipe,
        SorteioTipoPipe,
        PerfectScrollDirective
    ],
    exports: [
        MomentPipe,
        TimeToStringtPipe,
        TipoApostaPipe,
        TipoApostaCombatePipe,
        CalcularCotacaoPipe,
        SorteioTipoPipe,
        PerfectScrollDirective
    ]
})
export class UtilsModule { }

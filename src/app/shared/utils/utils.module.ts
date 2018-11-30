import { NgModule } from '@angular/core';

import {
    MomentPipe,
    TimeToStringtPipe,
    TipoApostaPipe,
    CalcularCotacaoPipe,
    // CalcularCotacaoFavZebPipe
} from './index';

@NgModule({
    declarations: [
        MomentPipe,
        TimeToStringtPipe,
        TipoApostaPipe,
        CalcularCotacaoPipe,
        // CalcularCotacaoFavZebPipe
    ],
    exports: [
        MomentPipe,
        TimeToStringtPipe,
        TipoApostaPipe,
        CalcularCotacaoPipe,
        // CalcularCotacaoFavZebPipe
    ]
})
export class UtilsModule { }

import { NgModule } from '@angular/core';

import {
    MomentPipe,
    TimeToStringtPipe,
    TipoApostaPipe,
    TipoApostaCustomPipe,
    CalcularCotacaoPipe,
    OddCategoriaPipe,
    SorteioTipoPipe,
    InfiniteScrollDirective,
    SafeHTMLPipe
} from './index';
import { SplitCodigoPipe } from './split-codigo.pipe';
import { FormatarNaturezaPipe } from './formatar-natureza.pipe';
import {FormatarStatusPipe} from "./formatar-status.pipe";

@NgModule({
    declarations: [
        MomentPipe,
        TimeToStringtPipe,
        TipoApostaPipe,
        TipoApostaCustomPipe,
        CalcularCotacaoPipe,
        OddCategoriaPipe,
        SafeHTMLPipe,
        SorteioTipoPipe,
        InfiniteScrollDirective,
        SplitCodigoPipe,
        FormatarNaturezaPipe,
        FormatarStatusPipe
    ],
    exports: [
        MomentPipe,
        TimeToStringtPipe,
        TipoApostaPipe,
        TipoApostaCustomPipe,
        CalcularCotacaoPipe,
        OddCategoriaPipe,
        SafeHTMLPipe,
        SorteioTipoPipe,
        InfiniteScrollDirective,
        SplitCodigoPipe,
        FormatarNaturezaPipe,
        FormatarStatusPipe
    ]
})
export class UtilsModule { }

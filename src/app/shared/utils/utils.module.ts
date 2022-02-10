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
    SafeHTMLPipe,
    SanitizeCampNamePipe,
    CotacaoPipe
} from './index';
import { SplitCodigoPipe } from './split-codigo.pipe';
import { FormatarNaturezaPipe } from './formatar-natureza.pipe';
import {DepositoStatusPixPipePipe} from "./depositos-status-pix.pipe";

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
        SanitizeCampNamePipe,
        DepositoStatusPixPipePipe,
        CotacaoPipe
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
        DepositoStatusPixPipePipe,
        SanitizeCampNamePipe,
        CotacaoPipe
    ]
})
export class UtilsModule { }

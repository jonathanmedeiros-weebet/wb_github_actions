import { NgModule } from '@angular/core';

import {
    MomentPipe,
    TimeToStringtPipe,
    TipoApostaPipe,
    TipoApostaCustomPipe,
    CalcularCotacaoPipe,
    OddCategoriaPipe,
    SorteioTipoPipe,
    DefaultImageDirective,
    InfiniteScrollDirective,
    SafeHTMLPipe,
    SanitizeCampNamePipe,
    CotacaoPipe,
    SplitCodigoPipe,
    FormatarNaturezaPipe,
    DepositoStatusPixPipePipe,
    SafeIframePipe
} from './index';


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
        DefaultImageDirective,
        InfiniteScrollDirective,
        SplitCodigoPipe,
        FormatarNaturezaPipe,
        SanitizeCampNamePipe,
        DepositoStatusPixPipePipe,
        CotacaoPipe,
        SafeIframePipe
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
        DefaultImageDirective,
        InfiniteScrollDirective,
        SplitCodigoPipe,
        FormatarNaturezaPipe,
        DepositoStatusPixPipePipe,
        SanitizeCampNamePipe,
        CotacaoPipe,
        SafeIframePipe
    ]
})
export class UtilsModule { }

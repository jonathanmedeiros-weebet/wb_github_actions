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
    FormatarFornecedoresPipe,
    FormatarPromocaoPipe,
    FormatarNomeJogoCassinoPipe,
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
        FormatarFornecedoresPipe,
        FormatarPromocaoPipe,
        FormatarNomeJogoCassinoPipe,
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
        FormatarFornecedoresPipe,
        FormatarPromocaoPipe,
        FormatarNomeJogoCassinoPipe,
        DepositoStatusPixPipePipe,
        SanitizeCampNamePipe,
        CotacaoPipe,
        SafeIframePipe
    ]
})
export class UtilsModule { }

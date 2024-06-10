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
    DepositoStatusPixPipePipe,
    SafeIframePipe,
    FormatPaymentMethodPipe
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
        SanitizeCampNamePipe,
        DepositoStatusPixPipePipe,
        CotacaoPipe,
        SafeIframePipe,
        FormatPaymentMethodPipe
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
        DepositoStatusPixPipePipe,
        SanitizeCampNamePipe,
        CotacaoPipe,
        SafeIframePipe,
        FormatPaymentMethodPipe
    ]
})
export class UtilsModule { }

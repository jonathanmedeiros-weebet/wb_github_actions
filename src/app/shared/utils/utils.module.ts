import { NgModule } from '@angular/core';

import {
    MomentPipe,
    TimeToStringtPipe,
} from './index';
import { TipoApostaPipe } from './tipo-aposta.pipe';

@NgModule({
    declarations: [
        MomentPipe,
        TimeToStringtPipe,
        TipoApostaPipe
    ],
    exports: [
        MomentPipe,
        TimeToStringtPipe,
        TipoApostaPipe
    ]
})
export class UtilsModule { }

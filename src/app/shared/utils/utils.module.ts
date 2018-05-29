import { NgModule } from '@angular/core';

import {
    MomentPipe,
    TimeToStringtPipe
} from './index';

@NgModule({
    declarations: [
        MomentPipe,
        TimeToStringtPipe
    ],
    exports: [
        MomentPipe,
        TimeToStringtPipe
    ]
})
export class UtilsModule { }

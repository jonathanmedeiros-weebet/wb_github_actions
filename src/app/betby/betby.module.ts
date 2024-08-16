import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { BetbyComponent } from './betby.component';

@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        BetbyComponent
    ],
    providers: []
})
export class BetbyModule { }

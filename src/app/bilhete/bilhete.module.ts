import { NgModule } from '@angular/core';

import { BilheteComponent } from './bilhete.component';
import { SharedModule } from '../shared/shared.module';
import { LiveService } from '../services';

@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        BilheteComponent
    ],
    providers: [LiveService]
})
export class BilheteModule { }

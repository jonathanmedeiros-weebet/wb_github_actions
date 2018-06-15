import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { ApuracaoRoutingModule } from './apuracao-routing.module';
import { ApuracaoComponent } from './apuracao.component';

@NgModule({
    imports: [SharedModule, ApuracaoRoutingModule],
    declarations: [ApuracaoComponent],
    providers: []
})
export class ApuracaoModule { }

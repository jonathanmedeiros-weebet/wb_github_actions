import { NgModule } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { SharedModule } from './../shared/shared.module';
import { SeninhaRoutingModule } from './seninha-routing.module';
import { SeninhaComponent } from './seninha.component';
import { TipoApostaService, SorteioService, ApostaService } from '../services';

@NgModule({
    imports: [SharedModule, SeninhaRoutingModule],
    declarations: [SeninhaComponent],
    providers: [TipoApostaService, SorteioService, ApostaService]
})
export class SeninhaModule { }

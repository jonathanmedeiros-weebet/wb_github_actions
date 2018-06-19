import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { QuininhaRoutingModule } from './quininha-routing.module';
import { QuininhaComponent } from './quininha.component';
import { TipoApostaService, SorteioService, ApostaService } from '../services';

@NgModule({
    imports: [SharedModule, QuininhaRoutingModule],
    declarations: [QuininhaComponent],
    providers: [TipoApostaService, SorteioService, ApostaService]
})
export class QuininhaModule { }

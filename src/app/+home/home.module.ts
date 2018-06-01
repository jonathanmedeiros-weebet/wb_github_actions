import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { TipoApostaService, SorteioService, ApostaService } from '../services';

@NgModule({
    imports: [SharedModule, HomeRoutingModule],
    declarations: [HomeComponent],
    providers: [TipoApostaService, SorteioService, ApostaService]
})
export class HomeModule { }

import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './dashboard/dashboard.component';
import {  ApostaEsportivaService, PreApostaEsportivaService } from '../services';
import { ValidarApostaEsportivaComponent } from './validar-aposta/validar-aposta-esportiva.component';

@NgModule({
    imports: [SharedModule, AdminRoutingModule],
    declarations: [
        AdminDashboardComponent,
        ValidarApostaEsportivaComponent
    ],
    providers: [
        ApostaEsportivaService,
        PreApostaEsportivaService
    ],
})
export class AdminModule { }

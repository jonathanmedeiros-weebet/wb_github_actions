import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './dashboard/dashboard.component';
import { ResultadosEsporteComponent } from './resultados/resultados-esporte.component';
import { CampeonatoService } from '../services';

@NgModule({
    imports: [SharedModule, AdminRoutingModule],
    declarations: [
        AdminDashboardComponent,
        ResultadosEsporteComponent
    ],
    providers: [
        CampeonatoService
    ],
})
export class AdminModule { }

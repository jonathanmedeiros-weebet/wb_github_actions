import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApuracaoEsporteComponent } from '../admin/esportes/apuracao/apuracao-esporte.component';
import { AdminApuracaoLoteriaComponent } from './loteria/apuracao-loteria.component';

export const routes: Routes = [
    { path: 'esportes', component: ApuracaoEsporteComponent },
    { path: 'loteria', component: AdminApuracaoLoteriaComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ApuracaoRoutingModule { }

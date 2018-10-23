import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminDashboardComponent } from './dashboard/dashboard.component';
import { ValidarApostaEsportivaComponent } from './validar-aposta/validar-aposta-esportiva.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: AdminDashboardComponent
    },
    {
        path: 'esportes',
        loadChildren: 'app/admin/esportes/esportes.module#AdminEsportesModule'
    },
    {
        path: 'loterias',
        loadChildren: 'app/admin/loterias/loterias.module#AdminLoteriasModule'
    },
    {
        path: 'validar-aposta',
        component: ValidarApostaEsportivaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule { }

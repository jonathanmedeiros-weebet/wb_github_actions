import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminApuracaoLoteriaComponent } from './apuracao/apuracao-loteria.component';
import { AdminResultadosLoteriaComponent } from './resultados/resultados-loteria.component';


export const routes: Routes = [
    {
        path: 'apuracao',
        component: AdminApuracaoLoteriaComponent
    },
    {
        path: 'resultados',
        component: AdminResultadosLoteriaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminLoteriasRoutingModule { }

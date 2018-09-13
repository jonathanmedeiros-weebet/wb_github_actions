import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApuracaoLoteriaComponent } from './apuracao/apuracao-loteria.component';
import { ResultadosLoteriaComponent } from './resultados/resultados-loteria.component';
import { SeninhaComponent } from './seninha/seninha.component';
import { QuininhaComponent } from './quininha/quininha.component';
import { AuthGuard, ExpiresGuard } from './../services';

export const routes: Routes = [
    {
        path: 'apuracao',
        component: ApuracaoLoteriaComponent,
        canActivate: [AuthGuard],
        canActivateChild: [ExpiresGuard]
    },
    {
        path: 'resultados',
        component: ResultadosLoteriaComponent
    },
    {
        path: 'seninha',
        component: SeninhaComponent
    },
    {
        path: 'quininha',
        component: QuininhaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoteriasRoutingModule { }

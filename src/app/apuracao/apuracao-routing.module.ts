import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApuracaoEsporteComponent } from './esportes/apuracao-esporte.component';
import { ApuracaoLoteriaComponent } from './loteria/apuracao-loteria.component';

export const routes: Routes = [
    { path: 'esportes', component: ApuracaoEsporteComponent },
    { path: 'loteria', component: ApuracaoLoteriaComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ApuracaoRoutingModule { }

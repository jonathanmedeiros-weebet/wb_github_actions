import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApuracaoEsporteComponent } from './esportes/apuracao-esporte.component';
import { ApuracaoLoteriaComponent } from './loteria/apuracao-loteria.component';
import { ApuracaoConsolidadaComponent } from './consolidada/apuracao-consolidada.component';

export const routes: Routes = [
    { path: 'esportes', component: ApuracaoEsporteComponent },
    { path: 'loteria', component: ApuracaoLoteriaComponent },
    { path: 'consolidada', component: ApuracaoConsolidadaComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ApuracaoRoutingModule { }

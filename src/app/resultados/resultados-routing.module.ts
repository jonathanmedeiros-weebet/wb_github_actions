import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResultadosEsporteComponent } from './esportes/resultados-esporte.component';
import { ResultadosLoteriasComponent } from './loterias/resultados-loterias.component';

export const routes: Routes = [
    { path: 'esportes', component: ResultadosEsporteComponent },
    { path: 'loterias', component: ResultadosLoteriasComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ResultadosRoutingModule { }

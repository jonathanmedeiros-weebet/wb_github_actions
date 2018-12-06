import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResultadosEsporteComponent } from './esportes/resultados-esporte.component';

export const routes: Routes = [
    { path: 'esportes', component: ResultadosEsporteComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ResultadosRoutingModule { }

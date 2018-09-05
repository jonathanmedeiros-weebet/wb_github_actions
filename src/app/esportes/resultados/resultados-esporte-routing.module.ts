import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResultadosEsporteComponent } from './resultados-esporte.component';

export const routes: Routes = [
    {
        path: '',
        component: ResultadosEsporteComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ResultadosEsporteRoutingModule { }

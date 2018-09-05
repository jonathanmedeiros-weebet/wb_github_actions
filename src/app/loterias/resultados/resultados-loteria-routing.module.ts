import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResultadosLoteriaComponent } from './resultados-loteria.component';

export const routes: Routes = [
    {
        path: '',
        component: ResultadosLoteriaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ResultadosLoteriaRoutingModule { }

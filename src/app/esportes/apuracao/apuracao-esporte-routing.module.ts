import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApuracaoEsporteComponent } from './apuracao-esporte.component';

export const routes: Routes = [
    {
        path: '',
        component: ApuracaoEsporteComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ApuracaoEsporteRoutingModule { }

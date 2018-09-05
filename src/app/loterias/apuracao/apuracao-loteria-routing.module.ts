import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApuracaoLoteriaComponent } from './apuracao-loteria.component';

export const routes: Routes = [
    {
        path: '',
        component: ApuracaoLoteriaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ApuracaoLoteriaRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValidarApostaEsportivaComponent } from './validar-aposta-esportiva.component';

export const routes: Routes = [
    {
        path: '',
        component: ValidarApostaEsportivaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ValidarApostaEsportivaRoutingModule { }

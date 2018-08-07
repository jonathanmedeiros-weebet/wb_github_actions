import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValidarApostaComponent } from './validar-aposta.component';

export const routes: Routes = [
    {
        path: '',
        component: ValidarApostaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ValidarApostaRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultarApostaComponent } from './consultar-aposta.component';

export const routes: Routes = [
    {
        path: '',
        component: ConsultarApostaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConsultarApostaRoutingModule { }

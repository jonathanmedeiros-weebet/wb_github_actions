import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApuracaoListagemComponent } from './apuracao-listagem/apuracao-listagem.component';

export const routes: Routes = [
    { path: '', component: ApuracaoListagemComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ApuracaoRoutingModule { }

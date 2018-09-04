import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiveListagemComponent } from './listagem/live-listagem.component';
import { LiveJogoComponent } from './jogo/live-jogo.component';

export const routes: Routes = [
    {
        path: '',
        component: LiveListagemComponent
    },
    {
        path: 'jogo/:id',
        component: LiveJogoComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LiveRoutingModule { }

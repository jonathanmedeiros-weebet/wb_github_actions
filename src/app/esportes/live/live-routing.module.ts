import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiveListagemComponent } from './listagem/live-listagem.component';
import { LiveWrapperComponent } from './wrapper/live-wrapper.component';
import { LiveJogoComponent } from './jogo/live-jogo.component';

export const routes: Routes = [
    {
        path: '',
        component: LiveWrapperComponent,
        children: [
            {
                path: '',
                redirectTo: 'jogos',
                pathMatch: 'full'
            },
            {
                path: 'jogos',
                component: LiveListagemComponent
            },
            {
                path: 'jogos/:id',
                component: LiveJogoComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LiveRoutingModule { }

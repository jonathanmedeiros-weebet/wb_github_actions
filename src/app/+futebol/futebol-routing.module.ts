import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FutebolWrapperComponent } from './wrapper/futebol-wrapper.component';
import { JogosComponent } from './jogos/jogos.component';
import { JogoComponent } from './jogo/jogo.component';

export const routes: Routes = [
    {
        path: '',
        component: FutebolWrapperComponent,
        children: [
            {
                path: '',
                redirectTo: 'jogos',
                pathMatch: 'full'
            },
            {
                path: 'jogos',
                component: JogosComponent
            },
            {
                path: 'jogo/:id',
                component: JogoComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FutebolRoutingModule { }

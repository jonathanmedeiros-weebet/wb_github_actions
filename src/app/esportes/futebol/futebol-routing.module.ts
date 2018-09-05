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
                path: 'jogos/:id',
                component: JogoComponent
            },
            {
                path: 'live',
                loadChildren: 'app/esportes/futebol/live/live.module#LiveModule'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FutebolRoutingModule { }

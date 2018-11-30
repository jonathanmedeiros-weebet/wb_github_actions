import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FutebolDefaultWrapperComponent } from './wrapper/futebol-default-wrapper.component';
import { FutebolListagemComponent } from './listagem/futebol-listagem.component';
import { FutebolJogoComponent } from './jogo/futebol-jogo.component';

export const routes: Routes = [
    {
        path: '',
        component: FutebolDefaultWrapperComponent,
        children: [
            {
                path: '',
                component: FutebolListagemComponent
            },
            {
                path: ':id',
                component: FutebolJogoComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FutebolDefaultRoutingModule { }

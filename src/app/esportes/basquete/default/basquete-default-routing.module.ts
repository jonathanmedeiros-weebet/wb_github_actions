import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BasqueteDefaultWrapperComponent } from './wrapper/basquete-default-wrapper.component';
import { BasqueteListagemComponent } from './listagem/basquete-listagem.component';
import { BasqueteJogoComponent } from './jogo/basquete-jogo.component';

export const routes: Routes = [
    {
        path: '',
        component: BasqueteDefaultWrapperComponent,
        children: [
            {
                path: '',
                component: BasqueteListagemComponent
            },
            {
                path: ':id',
                component: BasqueteJogoComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BasqueteDefaultRoutingModule { }

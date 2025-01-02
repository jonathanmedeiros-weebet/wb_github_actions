import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FutebolDefaultWrapperComponent } from './wrapper/futebol-default-wrapper.component';
import { FutebolJogoComponent } from './jogo/futebol-jogo.component';

export const routes: Routes = [
    {
        path: '',
        component: FutebolDefaultWrapperComponent
    },
    {
        path: 'highlight-game/:jogoDestaqueId',
        component: FutebolJogoComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FutebolDefaultRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CombateDefaultWrapperComponent } from './wrapper/combate-default-wrapper.component';
import { CombateListagemComponent } from './listagem/combate-listagem.component';
import { CombateEventoComponent } from './evento/combate-evento.component';

export const routes: Routes = [
    {
        path: '',
        component: CombateDefaultWrapperComponent,
        children: [
            {
                path: '',
                component: CombateListagemComponent
            },
            {
                path: ':id',
                component: CombateEventoComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CombateDefaultRoutingModule { }

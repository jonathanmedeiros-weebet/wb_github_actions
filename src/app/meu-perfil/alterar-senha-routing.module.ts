import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AlterarSenhaComponent} from './alterar-senha.component';
import {PagesLayoutComponent} from '../shared/layout/app-layouts';

export const routes: Routes = [
    {
        path: '',
        component: PagesLayoutComponent,
        children: [
            {
                path: '',
                component: AlterarSenhaComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AlterarSenhaRoutingModule {
}

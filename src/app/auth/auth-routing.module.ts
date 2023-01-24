import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RecuperarSenhaComponent} from './recuperar-senha/recuperar-senha.component';
import {ResetarSenhaComponent} from './resetar-senha/resetar-senha.component';
import {PagesLayoutComponent} from '../shared/layout/app-layouts';

export const routes: Routes = [
    {
        path: '',
        component: PagesLayoutComponent,
        children: [
            {
                path: 'recuperar-senha',
                component: RecuperarSenhaComponent
            },
            {
                path: 'resetar-senha/:token/:codigo',
                component: ResetarSenhaComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {
}

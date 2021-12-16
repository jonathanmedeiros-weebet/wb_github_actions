import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {CadastroComponent} from './cadastro/cadastro.component';
import {RecuperarSenhaComponent} from './recuperar-senha/recuperar-senha.component';
import {ResetarSenhaComponent} from './resetar-senha/resetar-senha.component';

export const routes: Routes = [
    {
        path: 'cadastro',
        component: CadastroComponent
    },
    {
        path: 'recuperar-senha',
        component: RecuperarSenhaComponent
    },
    {
        path: 'resetar-senha/:token/:codigo',
        component: ResetarSenhaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {
}

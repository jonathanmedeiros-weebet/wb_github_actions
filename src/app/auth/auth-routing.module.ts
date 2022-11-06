import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadastroComponent } from './cadastro/cadastro.component';
import { RecuperarSenhaComponent } from './recuperar-senha/recuperar-senha.component';
import { ResetarSenhaComponent } from './resetar-senha/resetar-senha.component';
import { ValidarEmailComponent } from './validar-email/validar-email.component';
import { ModuloClienteGuard } from '../services';

export const routes: Routes = [
    {
        path: 'cadastro',
        component: CadastroComponent,
        canActivate: [ModuloClienteGuard]
    },
    {
        path: 'recuperar-senha',
        component: RecuperarSenhaComponent
    },
    {
        path: 'resetar-senha/:token/:codigo',
        component: ResetarSenhaComponent
    },
    {
        path: 'validar-email',
        component: ValidarEmailComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {
}

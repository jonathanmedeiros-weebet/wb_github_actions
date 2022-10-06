import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { CadastroComponent } from './cadastro/cadastro.component';
import {NgxMaskModule} from 'ngx-mask';
import { RecuperarSenhaComponent } from './recuperar-senha/recuperar-senha.component';
import { ResetarSenhaComponent } from './resetar-senha/resetar-senha.component';
import {ValidarEmailComponent} from './validar-email/validar-email.component';

@NgModule({
    imports: [
        SharedModule,
        AuthRoutingModule,
        NgxMaskModule.forRoot()
    ],
    declarations: [
        CadastroComponent,
        RecuperarSenhaComponent,
        ResetarSenhaComponent,
        ValidarEmailComponent
    ],
    providers: []
})
export class AuthModule { }

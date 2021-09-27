import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { CadastroComponent } from './cadastro/cadastro/cadastro.component';
import {NgxMaskModule} from 'ngx-mask';

@NgModule({
    imports: [
        SharedModule,
        AuthRoutingModule,
        NgxMaskModule.forRoot()
    ],
    declarations: [
        LoginComponent,
        CadastroComponent
    ],
    providers: []
})
export class AuthModule { }

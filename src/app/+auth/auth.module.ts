import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ClienteService } from '../services';

@NgModule({
    imports: [SharedModule, AuthRoutingModule],
    declarations: [
        LoginComponent,
        ForgotComponent,
        ResetPasswordComponent
    ],
    providers: [ClienteService]
})
export class AuthModule { }

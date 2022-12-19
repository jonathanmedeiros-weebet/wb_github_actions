import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { CadastroComponent } from './cadastro/cadastro.component';
import { NgxMaskModule } from 'ngx-mask';
import { RecuperarSenhaComponent } from './recuperar-senha/recuperar-senha.component';
import { ResetarSenhaComponent } from './resetar-senha/resetar-senha.component';
import { NgHcaptchaModule } from 'ng-hcaptcha';
import { ValidarEmailComponent } from './validar-email/validar-email.component';
import { ModuloClienteGuard } from '../services';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [
        SharedModule,
        AuthRoutingModule,
        NgxMaskModule.forRoot(),
        NgHcaptchaModule.forRoot({
            siteKey: '47a691c3-c623-4ae4-939a-37b44e09a9e8',
            languageCode: 'pt'
        }),
        TranslateModule
    ],
    declarations: [
        CadastroComponent,
        RecuperarSenhaComponent,
        ResetarSenhaComponent,
        ValidarEmailComponent
    ],
    providers: [ModuloClienteGuard]
})
export class AuthModule {
}

import {NgModule} from '@angular/core';

import {SharedModule} from './../shared/shared.module';
import {AuthRoutingModule} from './auth-routing.module';
import {CadastroComponent} from './cadastro/cadastro.component';
import {NgxMaskModule} from 'ngx-mask';
import {RecuperarSenhaComponent} from './recuperar-senha/recuperar-senha.component';
import {ResetarSenhaComponent} from './resetar-senha/resetar-senha.component';
import {NgHcaptchaModule} from 'ng-hcaptcha';

@NgModule({
    imports: [
        SharedModule,
        AuthRoutingModule,
        NgxMaskModule.forRoot(),
        NgHcaptchaModule.forRoot({
            siteKey: '604d5165-30fe-4ed7-8808-cf5fd7fa3057',
            languageCode: 'pt'
        })
    ],
    declarations: [
        CadastroComponent,
        RecuperarSenhaComponent,
        ResetarSenhaComponent
    ],
    providers: []
})
export class AuthModule {
}

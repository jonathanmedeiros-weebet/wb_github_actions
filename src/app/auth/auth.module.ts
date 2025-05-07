import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { RecuperarSenhaComponent } from './recuperar-senha/recuperar-senha.component';
import { ResetarSenhaComponent } from './resetar-senha/resetar-senha.component';
import { NgHcaptchaModule } from 'ng-hcaptcha';
import { ModuloClienteGuard } from '../services';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        SharedModule,
        AuthRoutingModule,
        NgxMaskDirective,
        NgxMaskPipe,
        NgHcaptchaModule.forRoot({
            siteKey: '47a691c3-c623-4ae4-939a-37b44e09a9e8',
            languageCode: 'pt'
        }),
        TranslateModule
    ],
    declarations: [
        RecuperarSenhaComponent,
        ResetarSenhaComponent
    ],
    providers: [ModuloClienteGuard, provideNgxMask()]
})
export class AuthModule {
}

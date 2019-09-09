import { NgModule } from '@angular/core';

import { AcumuladaoRoutingModule } from './acumuladao-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AcumuladaoWrapperComponent } from './acumuladao-wrapper/acumuladao-wrapper.component';
import { AcumuladaoListagemComponent } from './acumuladao-listagem/acumuladao-listagem.component';
import { AcumuladaoFormComponent } from './acumuladao-form/acumuladao-form.component';
import { AcumuladaoService } from '../services';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
    imports: [
        SharedModule,
        AcumuladaoRoutingModule,
        NgxMaskModule.forRoot()
    ],
    declarations: [
        AcumuladaoWrapperComponent,
        AcumuladaoListagemComponent,
        AcumuladaoFormComponent
    ],
    providers: [AcumuladaoService]
})
export class AcumuladaoModule { }

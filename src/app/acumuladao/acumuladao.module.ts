import { NgModule } from '@angular/core';

import { AcumuladaoRoutingModule } from './acumuladao-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AcumuladaoWrapperComponent } from './acumuladao-wrapper/acumuladao-wrapper.component';
import { AcumuladaoListagemComponent } from './acumuladao-listagem/acumuladao-listagem.component';
import { AcumuladaoFormComponent } from './acumuladao-form/acumuladao-form.component';
import { ApostaAcumuladaoModalComponent } from './../shared/layout/modals/aposta-acumuladao-modal/aposta-acumuladao-modal.component';
import { AcumuladaoService } from '../services';

@NgModule({
    imports: [
        SharedModule,
        AcumuladaoRoutingModule
    ],
    declarations: [
        AcumuladaoWrapperComponent,
        AcumuladaoListagemComponent,
        AcumuladaoFormComponent,
        ApostaAcumuladaoModalComponent
    ],
    entryComponents: [
        ApostaAcumuladaoModalComponent
    ],
    providers: [AcumuladaoService]
})
export class AcumuladaoModule { }

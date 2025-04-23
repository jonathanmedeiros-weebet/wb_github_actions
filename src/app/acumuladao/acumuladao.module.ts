import { NgModule } from '@angular/core';

import { AcumuladaoRoutingModule } from './acumuladao-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AcumuladaoListagemComponent } from './acumuladao-listagem/acumuladao-listagem.component';
import { AcumuladaoFormComponent } from './acumuladao-form/acumuladao-form.component';
import { AcumuladaoService } from '../services';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@NgModule({
    imports: [
        SharedModule,
        AcumuladaoRoutingModule,
        NgxMaskDirective,
        NgxMaskPipe,
    ],
    declarations: [
        AcumuladaoListagemComponent,
        AcumuladaoFormComponent
    ],
    providers: [AcumuladaoService, provideNgxMask()]
})
export class AcumuladaoModule { }

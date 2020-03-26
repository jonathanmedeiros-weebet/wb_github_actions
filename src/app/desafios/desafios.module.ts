import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from './../shared/shared.module';
import { DesafiosRoutingModule } from './desafios-routing.module';
import { DesafioService, DesafioCategoriaService, DesafioBilheteService } from '../services';
import { DesafiosBilheteComponent } from './desafios-bilhete/desafios-bilhete.component';
import { DesafiosListagemComponent } from './desafios-listagem/desafios-listagem.component';
import { DesafiosWrapperComponent } from './desafios-wrapper/desafios-wrapper.component';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
    declarations: [
        DesafiosBilheteComponent,
        DesafiosListagemComponent,
        DesafiosWrapperComponent
    ],
    imports: [
        CommonModule,
        DesafiosRoutingModule,
        SharedModule,
        NgxMaskModule.forRoot()
    ],
    providers: [
        DesafioService,
        DesafioCategoriaService,
        DesafioBilheteService
    ]
})
export class DesafiosModule { }

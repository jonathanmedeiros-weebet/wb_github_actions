import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from './../shared/shared.module';
import { DesafiosRoutingModule } from './desafios-routing.module';
import { DesafioService, DesafioCategoriaService, DesafioBilheteService, DesafioApostaService, DesafioPreApostaService } from '../services';
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
    exports: [
        DesafiosBilheteComponent
    ],
    providers: [
        DesafioService,
        DesafioCategoriaService,
        DesafioBilheteService,
        DesafioApostaService,
        DesafioPreApostaService
    ]
})
export class DesafiosModule { }

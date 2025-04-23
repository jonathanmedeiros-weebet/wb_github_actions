import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "./../shared/shared.module";
import { DesafiosRoutingModule } from "./desafios-routing.module";
import {
    DesafioApostaService,
    DesafioBilheteService,
    DesafioCategoriaService,
    DesafioPreApostaService,
    DesafioService,
} from "../services";
import { DesafiosListagemComponent } from "./desafios-listagem/desafios-listagem.component";
import { DesafiosWrapperComponent } from "./desafios-wrapper/desafios-wrapper.component";
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from "ngx-mask";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
    declarations: [DesafiosListagemComponent, DesafiosWrapperComponent],
    imports: [
        CommonModule,
        DesafiosRoutingModule,
        SharedModule,
        NgxMaskDirective,
        NgxMaskPipe,
        TranslateModule,
    ],
    exports: [],
    providers: [
        DesafioService,
        DesafioCategoriaService,
        DesafioBilheteService,
        DesafioApostaService,
        DesafioPreApostaService,
        provideNgxMask(),
    ],
})
export class DesafiosModule {}

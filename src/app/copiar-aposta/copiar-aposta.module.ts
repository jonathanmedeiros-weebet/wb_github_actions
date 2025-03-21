import { NgModule } from '@angular/core';

import { CopiarApostaWrapperComponent } from './wrapper/copiar-aposta-wrapper.component';
import { CopiarApostaLoteriasComponent } from './loterias/copiar-aposta-loterias.component';
import { SharedModule } from '../shared/shared.module';
import { CopiarApostaRoutingModule } from './copiar-aposta-routing.module';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
    imports: [
        SharedModule, 
        CopiarApostaRoutingModule, 
        NgxMaskDirective, 
        NgxMaskPipe,
    ],
    exports: [],
    declarations: [
        CopiarApostaWrapperComponent,
        CopiarApostaLoteriasComponent
    ],
    providers: [
        NgbActiveModal,
        provideNgxMask()
    ]
})
export class CopiarApostaModule { }

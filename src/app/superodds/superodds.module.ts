import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from './../shared/shared.module';
import { DesafioApostaService, DesafioBilheteService, DesafioCategoriaService, DesafioPreApostaService, DesafioService } from '../services';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { TranslateModule } from '@ngx-translate/core';
import { SuperoddsWrapperComponent } from './superodds-wrapper/superodds-wrapper.component';
import { SuperoddsListComponent } from './superodds-list/superodds-list.component';
import { SuperoddsRoutingModule } from './superodds-routing.module';
import { SuperoddService } from '../shared/services/superodd.service';

@NgModule({
    declarations: [
        SuperoddsListComponent,
        SuperoddsWrapperComponent,
    ],
    imports: [
        CommonModule,
        SuperoddsRoutingModule,
        SharedModule,
        TranslateModule,
        NgxMaskDirective,
        NgxMaskPipe
    ],
    exports: [
    ],
    providers: [
        SuperoddService,
        DesafioService,
        DesafioCategoriaService,
        DesafioBilheteService,
        DesafioApostaService,
        DesafioPreApostaService,
        provideNgxMask()
    ]
})
export class SuperoddsModule { }

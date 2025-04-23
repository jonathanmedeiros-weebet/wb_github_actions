import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientePerfilRoutingModule } from './cliente-perfil-routing.module';
import { ClientePerfilComponent } from './cliente-perfil.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    declarations: [
        ClientePerfilComponent,
    ],
    imports: [
        CommonModule,
        ClientePerfilRoutingModule,
        SharedModule,
        NgxMaskDirective,
        NgxMaskPipe,
        NgbModule,
    ],
    providers: [provideNgxMask()]
})
export class ClientePerfilModule {
}

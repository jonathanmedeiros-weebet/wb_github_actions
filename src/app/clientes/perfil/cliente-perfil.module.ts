import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ClientePerfilRoutingModule} from './cliente-perfil-routing.module';
import {ClientePerfilComponent} from './cliente-perfil.component';
import {SharedModule} from '../../shared/shared.module';
import {NgxMaskModule} from 'ngx-mask';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    declarations: [
        ClientePerfilComponent,
    ],
    imports: [
        CommonModule,
        ClientePerfilRoutingModule,
        SharedModule,
        NgxMaskModule,
        NgbModule
    ]
})
export class ClientePerfilModule {
}

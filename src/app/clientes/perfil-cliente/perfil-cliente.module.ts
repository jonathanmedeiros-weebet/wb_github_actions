import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PerfilClienteRoutingModule} from './perfil-cliente-routing.module';
import {PerfilClienteComponent} from './perfil-cliente.component';
import {SharedModule} from '../../shared/shared.module';
import {NgxMaskModule} from 'ngx-mask';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    declarations: [
        PerfilClienteComponent,
    ],
    imports: [
        CommonModule,
        PerfilClienteRoutingModule,
        SharedModule,
        NgxMaskModule,
        NgbModule
    ]
})
export class PerfilClienteModule {
}

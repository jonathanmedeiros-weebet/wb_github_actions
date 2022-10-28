import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {ClientesRoutingModule} from './clientes-routing.module';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        SharedModule,
        ClientesRoutingModule,
        NgbModule
    ],
    providers: [
        NgbActiveModal
    ]
})
export class ClientesModule {
}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {ClientesRoutingModule} from './clientes-routing.module';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { JogoService } from '../shared/services/aposta-esportiva/jogo.service';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        SharedModule,
        ClientesRoutingModule,
        NgbModule
    ],
    providers: [
        NgbActiveModal,
        JogoService
    ]
})
export class ClientesModule {
}

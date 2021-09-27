import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ClientesComponent} from './clientes.component';
import {SharedModule} from '../shared/shared.module';
import {ClientesRoutingModule} from './clientes-routing.module';

@NgModule({
    declarations: [ClientesComponent],
    imports: [
        CommonModule,
        SharedModule,
        ClientesRoutingModule
    ]
})
export class ClientesModule {
}

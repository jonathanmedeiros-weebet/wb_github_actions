import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ClientesComponent} from './clientes.component';
import {SharedModule} from '../shared/shared.module';
import {ClientesRoutingModule} from './clientes-routing.module';
import { PerfilClienteComponent } from './perfil-cliente/perfil-cliente.component';

@NgModule({
    declarations: [ClientesComponent, PerfilClienteComponent],
    imports: [
        CommonModule,
        SharedModule,
        ClientesRoutingModule
    ]
})
export class ClientesModule {
}

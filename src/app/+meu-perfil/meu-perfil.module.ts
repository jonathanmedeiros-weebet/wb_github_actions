import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { MeuPerfilRoutingModule } from './meu-perfil-routing.module';
import { MeuPerfilComponent } from './meu-perfil.component';

@NgModule({
    imports: [SharedModule, MeuPerfilRoutingModule],
    declarations: [MeuPerfilComponent],
    providers: []
})
export class MeuPerfilModule { }

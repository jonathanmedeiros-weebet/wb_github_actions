import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { AlterarSenhaRoutingModule } from './alterar-senha-routing.module';
import { AlterarSenhaComponent } from './alterar-senha.component';

@NgModule({
    imports: [SharedModule, AlterarSenhaRoutingModule],
    declarations: [AlterarSenhaComponent],
    providers: []
})
export class AlterarSenhaModule { }

import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { AlterarSenhaRoutingModule } from './alterar-senha-routing.module';
import { AlterarSenhaComponent } from './alterar-senha.component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [SharedModule, AlterarSenhaRoutingModule, TranslateModule],
    declarations: [AlterarSenhaComponent],
    providers: []
})
export class AlterarSenhaModule { }

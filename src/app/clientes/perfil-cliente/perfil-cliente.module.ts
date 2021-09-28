import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PerfilClienteRoutingModule} from './perfil-cliente-routing.module';
import {PerfilClienteComponent} from './perfil-cliente.component';
import {SharedModule} from '../../shared/shared.module';
import {NgxMaskModule} from 'ngx-mask';
import {InformacoesContatoComponent} from './informacoes-contato/informacoes-contato.component';
import {InformacoesAcessoComponent} from './informacoes-acesso/informacoes-acesso.component';
import {InformacoesEnderecoComponent} from './informacoes-endereco/informacoes-endereco.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {InformacoesPessoaisComponent} from './informacoes-pessoais/informacoes-pessoais.component';


@NgModule({
    declarations: [
        PerfilClienteComponent,
        InformacoesContatoComponent,
        InformacoesAcessoComponent,
        InformacoesEnderecoComponent,
        InformacoesPessoaisComponent
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

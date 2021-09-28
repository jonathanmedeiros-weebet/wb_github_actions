import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PerfilClienteComponent} from './perfil-cliente.component';
import {InformacoesPessoaisComponent} from './informacoes-pessoais/informacoes-pessoais.component';
import {InformacoesContatoComponent} from './informacoes-contato/informacoes-contato.component';
import {InformacoesEnderecoComponent} from './informacoes-endereco/informacoes-endereco.component';
import {InformacoesAcessoComponent} from './informacoes-acesso/informacoes-acesso.component';

const routes: Routes = [{
    path: '',
    component: PerfilClienteComponent,
    children: [
        {
            path: '',
            redirectTo: 'meus-dados',
            pathMatch: 'full'
        },
        {
            path: 'meus-dados',
            component: InformacoesPessoaisComponent
        },
        {
            path: 'contato',
            component: InformacoesContatoComponent
        },
        {
            path: 'endereco',
            component: InformacoesEnderecoComponent
        },
        {
            path: 'acesso',
            component: InformacoesAcessoComponent
        }
    ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerfilClienteRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SolicitacaoRecargaComponent} from './solicitacao-recarga.component';

const routes: Routes = [{
    path: '',
    component: SolicitacaoRecargaComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitacaoRecargaRoutingModule { }

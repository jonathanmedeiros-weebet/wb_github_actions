import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ClientePerfilComponent} from './cliente-perfil.component';

const routes: Routes = [{
    path: '',
    component: ClientePerfilComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientePerfilRoutingModule { }

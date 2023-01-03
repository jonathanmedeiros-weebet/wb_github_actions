import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilPixComponent } from './perfil-pix.component';

const routes: Routes = [{
    path: '',
    component: PerfilPixComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerfilPixRoutingModule { }

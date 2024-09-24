import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CarteiraComponent} from './carteira.component';

const routes: Routes = [
    {
        path: '',
        component: CarteiraComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarteiraRoutingModule { }

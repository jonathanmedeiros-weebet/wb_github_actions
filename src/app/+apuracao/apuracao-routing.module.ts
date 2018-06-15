import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApuracaoComponent } from './apuracao.component';

export const routes: Routes = [
  {
    path: '',
    component: ApuracaoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApuracaoRoutingModule {}

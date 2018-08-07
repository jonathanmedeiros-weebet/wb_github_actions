import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApuracaoFutebolComponent } from './futebol/apuracao-futebol.component';
import { ApuracaoLoteriaComponent } from './loteria/apuracao-loteria.component';

export const routes: Routes = [
  {
    path: 'futebol',
    component: ApuracaoFutebolComponent
  },
  {
    path: 'loteria',
    component: ApuracaoLoteriaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApuracaoRoutingModule {}

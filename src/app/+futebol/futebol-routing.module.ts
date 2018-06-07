import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FutebolComponent } from './futebol.component';

export const routes: Routes = [
  {
    path: '',
    component: FutebolComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FutebolRoutingModule {}

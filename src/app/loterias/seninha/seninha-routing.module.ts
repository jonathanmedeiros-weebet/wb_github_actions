import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeninhaComponent } from './seninha.component';

export const routes: Routes = [
  {
    path: '',
    component: SeninhaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeninhaRoutingModule {}

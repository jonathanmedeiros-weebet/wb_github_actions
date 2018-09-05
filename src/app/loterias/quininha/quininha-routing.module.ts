import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuininhaComponent } from './quininha.component';

export const routes: Routes = [
  {
    path: '',
    component: QuininhaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuininhaRoutingModule {}

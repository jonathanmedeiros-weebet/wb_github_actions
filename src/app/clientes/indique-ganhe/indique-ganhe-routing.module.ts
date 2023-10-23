import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IndiqueGanheComponent } from './indique-ganhe.component';

const routes: Routes = [
    {
        path: '',
        component: IndiqueGanheComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndiqueGanheRoutingModule { }

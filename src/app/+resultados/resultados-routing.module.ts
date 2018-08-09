import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResultadosLoteriaComponent } from './loteria/resultados-loteria.component';
import { ResultadosFutebolComponent } from './futebol/resultados-futebol.component';

export const routes: Routes = [
  {
    path: 'loteria',
    component: ResultadosLoteriaComponent
  },
  {
    path: 'futebol',
    component: ResultadosFutebolComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResultadosRoutingModule {}

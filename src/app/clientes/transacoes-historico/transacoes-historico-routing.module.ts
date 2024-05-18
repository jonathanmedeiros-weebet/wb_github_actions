import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransacoesHistoricoComponent } from './transacoes-historico.component';

const routes: Routes = [
    {
        path: '',
        component: TransacoesHistoricoComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransacoesHistoricoRoutingModule { }

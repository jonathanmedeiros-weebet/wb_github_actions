import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformacoesComponent } from './informacoes.component';

const routes: Routes = [
    { path: 'deposito', component: InformacoesComponent, data: { pagina: 'deposito' } },
    { path: 'regras', component: InformacoesComponent, data: { pagina: 'regras' } }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InformacoesRoutingModule { }

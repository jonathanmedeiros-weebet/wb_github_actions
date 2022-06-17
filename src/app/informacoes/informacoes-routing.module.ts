import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformacoesComponent } from './informacoes.component';
import {PagesLayoutComponent} from '../shared/layout/app-layouts/pages-layout.component';

const routes: Routes = [
    {
        path: '',
        component: PagesLayoutComponent,
        children: [
            { path: 'deposito', component: InformacoesComponent, data: { pagina: 'deposito' } },
            { path: 'regras', component: InformacoesComponent, data: { pagina: 'regras' } }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InformacoesRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformacoesComponent } from './informacoes.component';
import { PagesNoNavLayoutComponent } from '../shared/layout/app-layouts/pages-no-nav-layout.component';

const routes: Routes = [
    {
        path: '',
        component: PagesNoNavLayoutComponent,
        children: [
            { path: 'regras', component: InformacoesComponent, data: { pagina: 'regras' } },
            { path: 'quem-somos', component: InformacoesComponent, data: { pagina: 'quem-somos' } },
            { path: 'jogo-responsavel', component: InformacoesComponent, data: { pagina: 'jogo-responsavel' } },
            { path: 'termos-condicoes', component: InformacoesComponent, data: { pagina: 'termos-condicoes' } },
            { path: 'politica-privacidade', component: InformacoesComponent, data: { pagina: 'politica-privacidade' } },
            { path: 'politica-aml', component: InformacoesComponent, data: { pagina: 'politica-aml' } },
            { path: 'termos-afiliados', component: InformacoesComponent, data: { pagina: 'termos-afiliados' } },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InformacoesRoutingModule { }

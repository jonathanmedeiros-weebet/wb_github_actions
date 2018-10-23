import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResultadosEsporteComponent } from './resultados/resultados-esporte.component';
import { ApuracaoEsporteComponent } from './apuracao/apuracao-esporte.component';
import { ConsultarApostaEsporteComponent } from './consultar-aposta/consultar-aposta-esporte.component';

export const routes: Routes = [
    {
        path: 'apuracao',
        component: ApuracaoEsporteComponent
    },
    {
        path: 'resultados',
        component: ResultadosEsporteComponent
    },
    {
        path: 'consultar-aposta',
        component: ConsultarApostaEsporteComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminEsportesRoutingModule { }

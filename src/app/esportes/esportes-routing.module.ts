import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApuracaoEsporteComponent } from './apuracao/apuracao-esporte.component';
import { ConsultarApostaComponent } from './consultar-aposta/consultar-aposta.component';
import { ResultadosEsporteComponent } from './resultados/resultados-esporte.component';
import { ValidarApostaEsportivaComponent } from './validar-aposta/validar-aposta-esportiva.component';
import { AuthGuard, ExpiresGuard } from './../services';

export const routes: Routes = [
    {
        path: 'apuracao',
        component: ApuracaoEsporteComponent,
        canActivate: [AuthGuard],
        canActivateChild: [ExpiresGuard]
    },
    {
        path: 'consultar-aposta',
        component: ConsultarApostaComponent
    },
    {
        path: 'futebol',
        loadChildren: 'app/esportes/futebol/futebol.module#FutebolModule'
    },
    {
        path: 'resultados',
        component: ResultadosEsporteComponent
    },
    {
        path: 'validar-aposta',
        component: ValidarApostaEsportivaComponent,
        canActivate: [AuthGuard],
        canActivateChild: [ExpiresGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EsportesRoutingModule { }

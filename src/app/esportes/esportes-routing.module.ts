import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: 'apuracao',
        loadChildren: 'app/esportes/apuracao/apuracao-esporte.module#ApuracaoEsporteModule'
    },
    {
        path: 'consultar-aposta',
        loadChildren: 'app/esportes/consultar-aposta/consultar-aposta.module#ConsultarApostaModule'
    },
    {
        path: 'futebol',
        loadChildren: 'app/esportes/futebol/futebol.module#FutebolModule'
    },
    {
        path: 'resultados',
        loadChildren: 'app/esportes/resultados/resultados-esporte.module#ResultadosEsporteModule'
    },
    {
        path: 'validar-aposta',
        loadChildren: 'app/esportes/validar-aposta/validar-aposta-esportiva.module#ValidarApostaEsportivaModule'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EsportesRoutingModule { }

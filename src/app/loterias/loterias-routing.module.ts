import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: 'apuracao',
        loadChildren: 'app/loterias/apuracao/apuracao-loteria.module#ApuracaoLoteriaModule'
    },
    {
        path: 'resultados',
        loadChildren: 'app/loterias/resultados/resultados-loteria.module#ResultadosLoteriaModule'
    },
    {
        path: 'seninha',
        loadChildren: 'app/loterias/seninha/seninha.module#SeninhaModule'
    },
    {
        path: 'quininha',
        loadChildren: 'app/loterias/quininha/quininha.module#QuininhaModule'
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoteriasRoutingModule { }

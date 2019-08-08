import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EsportesWrapperComponent } from './../wrapper/esportes-wrapper.component';
import { AoVivoGuard } from '../../services';

export const routes: Routes = [
    {
        path: '',
        component: EsportesWrapperComponent,
        children: [
            {
                path: 'jogos',
                loadChildren: () => import('app/esportes/futebol/default/futebol-default.module').then(m => m.FutebolDefaultModule)
            },
            {
                path: 'live',
                loadChildren: () => import('app/esportes/futebol/live/live.module').then(m => m.LiveModule),
                canActivate: [AoVivoGuard]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FutebolRoutingModule { }

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
                loadChildren: 'app/esportes/futebol/default/futebol-default.module#FutebolDefaultModule'
            },
            {
                path: 'live',
                loadChildren: 'app/esportes/futebol/live/live.module#LiveModule',
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

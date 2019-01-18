import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FutebolWrapperComponent } from './wrapper/futebol-wrapper.component';
import { AoVivoGuard } from '../../services';

export const routes: Routes = [
    {
        path: '',
        component: FutebolWrapperComponent,
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

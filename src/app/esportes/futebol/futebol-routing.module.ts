import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AoVivoGuard } from '../../services';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('app/esportes/futebol/default/futebol-default.module').then(m => m.FutebolDefaultModule)
    },
    {
        path: 'live',
        loadChildren: () => import('app/esportes/futebol/live/live.module').then(m => m.LiveModule),
        canActivate: [AoVivoGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FutebolRoutingModule { }

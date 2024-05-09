import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
    AoVivoGuard, BasqueteGuard, CombateGuard,
    EsportsGuard, FutebolAmericanoGuard, FutsalGuard,
    HoqueiGeloGuard, TenisGuard, TenisMesaGuard,
    VoleiGuard
} from '../services';
import {SportLayoutComponent} from '../shared/layout/app-layouts';
import { EsporteGuard } from '../shared/services/guards/esporte.guard';

import * as sportsIds from '../shared/constants/sports-ids';

export const routes: Routes = [
    {
        path: '',
        component: SportLayoutComponent,
        canActivateChild: [EsporteGuard],
        children: [
            {
                path: '',
                redirectTo: 'futebol',
                pathMatch: 'full',
            },
            {
                path: 'futebol',
                loadChildren: () => import('./futebol/futebol.module').then(m => m.FutebolModule),
            },
            {
                path: 'combate',
                data: { sportId: sportsIds.BOXING_ID },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [CombateGuard]
            },
            {
                path: 'futebol-americano',
                data: { sportId: sportsIds.FOOTBALL_ID },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [FutebolAmericanoGuard]
            },
            {
                path: 'tenis',
                data: { sportId: sportsIds.TENNIS_ID },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [TenisGuard]
            },
            {
                path: 'hoquei-gelo',
                data: { sportId: sportsIds.ICE_HOCKEY_ID },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [HoqueiGeloGuard]
            },
            {
                path: 'basquete',
                data: { sportId: sportsIds.BASKETBALL_ID },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [BasqueteGuard]
            },
            {
                path: 'futsal',
                data: { sportId: sportsIds.FUTSAL_ID },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [FutsalGuard]
            },
            {
                path: 'volei',
                data: { sportId: sportsIds.VOLLEYBALL_ID },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [VoleiGuard]
            },
            {
                path: 'tenis-mesa',
                data: { sportId: sportsIds.TABLE_TENNIS_ID },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [TenisMesaGuard]
            },
            {
                path: 'esports',
                data: { sportId: sportsIds.E_SPORTS_ID },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [EsportsGuard]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EsportesRoutingModule {
}

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
                data: { sport: 'boxing' },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [CombateGuard]
            },
            {
                path: 'futebol-americano',
                data: { sport: 'americanFootball' },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [FutebolAmericanoGuard]
            },
            {
                path: 'tenis',
                data: { sport: 'tennis' },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [TenisGuard]
            },
            {
                path: 'hoquei-gelo',
                data: { sport: 'iceHockey' },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [HoqueiGeloGuard]
            },
            {
                path: 'basquete',
                data: { sport: 'basketball' },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [BasqueteGuard]
            },
            {
                path: 'futsal',
                data: { sport: 'futsal' },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [FutsalGuard]
            },
            {
                path: 'volei',
                data: { sport: 'volleyball' },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [VoleiGuard]
            },
            {
                path: 'tenis-mesa',
                data: { sport: 'tableTennis' },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [TenisMesaGuard]
            },
            {
                path: 'esports',
                data: { sport: 'eSports' },
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

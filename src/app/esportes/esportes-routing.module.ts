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

export const routes: Routes = [
    {
        path: '',
        component: SportLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'futebol',
                pathMatch: 'full'
            },
            {
                path: 'live',
                loadChildren: () => import('./live/live.module').then(m => m.LiveModule),
                canActivate: [AoVivoGuard, EsporteGuard]
            },
            {
                path: 'futebol',
                loadChildren: () => import('./futebol/futebol.module').then(m => m.FutebolModule),
                canActivate: [EsporteGuard],
            },
            {
                path: 'combate',
                data: { sportId: '9' },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [CombateGuard, EsporteGuard]
            },
            {
                path: 'futebol-americano',
                data: { sportId: '12' },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [FutebolAmericanoGuard, EsporteGuard]
            },
            {
                path: 'tenis',
                data: { sportId: '13' },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [TenisGuard, EsporteGuard]
            },
            {
                path: 'hoquei-gelo',
                data: { sportId: '17' },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [HoqueiGeloGuard, EsporteGuard]
            },
            {
                path: 'basquete',
                data: { sportId: '18' },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [BasqueteGuard, EsporteGuard]
            },
            {
                path: 'futsal',
                data: { sportId: '83' },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [FutsalGuard, EsporteGuard]
            },
            {
                path: 'volei',
                data: { sportId: '91' },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [VoleiGuard, EsporteGuard]
            },
            {
                path: 'tenis-mesa',
                data: { sportId: '92' },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [TenisMesaGuard, EsporteGuard]
            },
            {
                path: 'esports',
                data: { sportId: '151' },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [EsportsGuard, EsporteGuard]
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

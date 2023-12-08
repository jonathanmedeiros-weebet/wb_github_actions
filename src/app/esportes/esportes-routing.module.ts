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
                data: { sportId: '9' },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [CombateGuard]
            },
            {
                path: 'futebol-americano',
                data: { sportId: '12' },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [FutebolAmericanoGuard]
            },
            {
                path: 'tenis',
                data: { sportId: '13' },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [TenisGuard]
            },
            {
                path: 'hoquei-gelo',
                data: { sportId: '17' },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [HoqueiGeloGuard]
            },
            {
                path: 'basquete',
                data: { sportId: '48242' },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [BasqueteGuard]
            },
            {
                path: 'futsal',
                data: { sportId: '83' },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [FutsalGuard]
            },
            {
                path: 'volei',
                data: { sportId: '91' },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [VoleiGuard]
            },
            {
                path: 'tenis-mesa',
                data: { sportId: '92' },
                loadChildren: () => import('./generico/generico.module').then(m => m.GenericoModule),
                canActivate: [TenisMesaGuard]
            },
            {
                path: 'esports',
                data: { sportId: '151' },
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

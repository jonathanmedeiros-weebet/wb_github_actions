import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BasqueteGuard, CombateGuard, EsportsGuard } from '../services';
import { EsportesWrapperComponent } from './wrapper/esportes-wrapper.component';

export const routes: Routes = [
    {
        path: '',
        component: EsportesWrapperComponent,
        children: [
            {
                path: 'futebol',
                loadChildren: () => import('app/esportes/futebol/futebol.module').then(m => m.FutebolModule),
            },
            {
                path: 'combate',
                data: { sportId: '9' },
                loadChildren: () => import('app/esportes/generico/generico.module').then(m => m.GenericoModule),
                canActivate: [CombateGuard]
            },
            {
                path: 'futebol-americano',
                data: { sportId: '12' },
                loadChildren: () => import('app/esportes/generico/generico.module').then(m => m.GenericoModule),
            },
            {
                path: 'tenis',
                data: { sportId: '13' },
                loadChildren: () => import('app/esportes/generico/generico.module').then(m => m.GenericoModule),
            },
            {
                path: 'hoquei-gelo',
                data: { sportId: '17' },
                loadChildren: () => import('app/esportes/generico/generico.module').then(m => m.GenericoModule),
            },
            {
                path: 'basquete',
                data: { sportId: '18' },
                loadChildren: () => import('app/esportes/generico/generico.module').then(m => m.GenericoModule),
                canActivate: [BasqueteGuard]
            },
            {
                path: 'futsal',
                data: { sportId: '83' },
                loadChildren: () => import('app/esportes/generico/generico.module').then(m => m.GenericoModule),
                canActivate: [BasqueteGuard]
            },
            {
                path: 'volei',
                data: { sportId: '91' },
                loadChildren: () => import('app/esportes/generico/generico.module').then(m => m.GenericoModule),
                canActivate: [BasqueteGuard]
            },
            {
                path: 'tenis-mesa',
                data: { sportId: '92' },
                loadChildren: () => import('app/esportes/generico/generico.module').then(m => m.GenericoModule),
                canActivate: [BasqueteGuard]
            },
            {
                path: 'esports',
                data: { sportId: '151' },
                loadChildren: () => import('app/esportes/generico/generico.module').then(m => m.GenericoModule),
                canActivate: [EsportsGuard]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EsportesRoutingModule { }

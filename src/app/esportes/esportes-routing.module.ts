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
                data: { sportId: '1' },
                loadChildren: () => import('app/esportes/futebol/futebol.module').then(m => m.FutebolModule),
            },
            {
                path: 'basquete',
                loadChildren: () => import('app/esportes/generico/generico.module').then(m => m.GenericoModule),
                canActivate: [BasqueteGuard]
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

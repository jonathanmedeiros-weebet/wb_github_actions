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
                loadChildren: () => import('app/esportes/pre-jogo/pre-jogo.module').then(m => m.PreJogoModule),
            },
            {
                path: 'basquete',
                loadChildren: () => import('app/esportes/pre-jogo/pre-jogo.module').then(m => m.PreJogoModule),
                canActivate: [BasqueteGuard]
            },
            {
                path: 'combate',
                data: { sportId: '9' },
                loadChildren: () => import('app/esportes/pre-jogo/pre-jogo.module').then(m => m.PreJogoModule),
                canActivate: [CombateGuard]
            },
            {
                path: 'futebol-americano',
                data: { sportId: '12' },
                loadChildren: () => import('app/esportes/pre-jogo/pre-jogo.module').then(m => m.PreJogoModule),
            },
            {
                path: 'tenis',
                data: { sportId: '13' },
                loadChildren: () => import('app/esportes/pre-jogo/pre-jogo.module').then(m => m.PreJogoModule),
            },
            {
                path: 'esports',
                data: { sportId: '151' },
                loadChildren: () => import('app/esportes/pre-jogo/pre-jogo.module').then(m => m.PreJogoModule),
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

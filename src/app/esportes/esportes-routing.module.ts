import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BasqueteGuard, CombateGuard, EsportsGuard } from '../services';

export const routes: Routes = [
    {
        path: 'futebol',
        loadChildren: () => import('app/esportes/futebol/futebol.module').then(m => m.FutebolModule)
    },
    {
        path: 'basquete',
        loadChildren: () => import('app/esportes/modalidades/modalidades.module').then(m => m.ModalidadesModule),
        canActivate: [BasqueteGuard]
    },
    {
        path: 'combate',
        data: { sportId: '9' },
        loadChildren: () => import('app/esportes/modalidades/modalidades.module').then(m => m.ModalidadesModule),
        canActivate: [CombateGuard]
    },
    {
        path: 'futebol-americano',
        data: { sportId: '12' },
        loadChildren: () => import('app/esportes/modalidades/modalidades.module').then(m => m.ModalidadesModule),
    },
    {
        path: 'tenis',
        data: { sportId: '13' },
        loadChildren: () => import('app/esportes/modalidades/modalidades.module').then(m => m.ModalidadesModule),
    },
    {
        path: 'esports',
        loadChildren: () => import('app/esportes/esports/esports.module').then(m => m.EsportsModule),
        canActivate: [EsportsGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EsportesRoutingModule { }

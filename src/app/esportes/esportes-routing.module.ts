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
        loadChildren: () => import('app/esportes/basquete/basquete.module').then(m => m.BasqueteModule),
        canActivate: [BasqueteGuard]
    },
    {
        path: 'combate',
        loadChildren: () => import('app/esportes/combate/combate.module').then(m => m.CombateModule),
        canActivate: [CombateGuard]
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

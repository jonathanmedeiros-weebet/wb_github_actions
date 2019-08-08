import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BasqueteGuard, CombateGuard } from '../services';

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
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EsportesRoutingModule { }

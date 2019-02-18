import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BasqueteGuard } from '../services';

export const routes: Routes = [
    {
        path: 'futebol',
        loadChildren: 'app/esportes/futebol/futebol.module#FutebolModule'
    },
    {
        path: 'basquete',
        loadChildren: 'app/esportes/basquete/basquete.module#BasqueteModule',
        canActivate: [BasqueteGuard]
    },
    {
        path: 'combate',
        loadChildren: 'app/esportes/combate/combate.module#CombateModule',
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EsportesRoutingModule { }

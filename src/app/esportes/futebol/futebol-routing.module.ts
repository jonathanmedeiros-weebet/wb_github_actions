import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./default/futebol-default.module').then(m => m.FutebolDefaultModule)
    },
    {
        path: 'copa',
        loadChildren: () => import('./default/futebol-default.module').then(m => m.FutebolDefaultModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FutebolRoutingModule { }

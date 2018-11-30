import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FutebolWrapperComponent } from './wrapper/futebol-wrapper.component';
export const routes: Routes = [
    {
        path: '',
        component: FutebolWrapperComponent,
        children: [
            // {
            //     path: '',
            //     redirectTo: 'jogos',
            //     pathMatch: 'full'
            // },
            {
                path: 'jogos',
                loadChildren: 'app/esportes/futebol/default/futebol-default.module#FutebolDefaultModule'
            },
            {
                path: 'live',
                loadChildren: 'app/esportes/futebol/live/live.module#LiveModule'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FutebolRoutingModule { }

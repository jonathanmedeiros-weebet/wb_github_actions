import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BasqueteWrapperComponent } from './wrapper/basquete-wrapper.component';
export const routes: Routes = [
    {
        path: '',
        component: BasqueteWrapperComponent,
        children: [
            {
                path: 'jogos',
                loadChildren: 'app/esportes/basquete/default/basquete-default.module#BasqueteDefaultModule'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BasqueteRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EsportesWrapperComponent } from './../wrapper/esportes-wrapper.component';

export const routes: Routes = [
    {
        path: '',
        component: EsportesWrapperComponent,
        children: [
            {
                path: 'eventos',
                loadChildren: () => import('app/esportes/basquete/default/basquete-default.module').then(m => m.BasqueteDefaultModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BasqueteRoutingModule { }

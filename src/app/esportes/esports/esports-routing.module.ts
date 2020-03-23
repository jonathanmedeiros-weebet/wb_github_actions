import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EsportesWrapperComponent } from '../wrapper/esportes-wrapper.component';

export const routes: Routes = [
    {
        path: '',
        component: EsportesWrapperComponent,
        children: [
            {
                path: 'eventos',
                loadChildren: () => import('app/esportes/esports/default/esports-default.module').then(m => m.EsportsDefaultModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EsportsRoutingModule { }

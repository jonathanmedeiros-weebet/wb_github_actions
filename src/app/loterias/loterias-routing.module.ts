import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeninhaComponent } from './seninha/seninha.component';
import { QuininhaComponent } from './quininha/quininha.component';
import { LoteriaPopularGuard, QuininhaGuard, SeninhaGuard } from './../services';
import { LoteriaLayoutComponent } from '../shared/layout/app-layouts';
import { LoteriaPopularComponent } from './loteria-popular/loteria-popular.component';

export const routes: Routes = [
    {
        path: '',
        component: LoteriaLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'quininha',
                pathMatch: 'full'
            },
            {
                path: 'quininha',
                component: QuininhaComponent,
                canActivate: [QuininhaGuard]
            },
            {
                path: 'seninha',
                component: SeninhaComponent,
                canActivate: [SeninhaGuard]
            },
            {
                path: 'loteria-popular',
                component: LoteriaPopularComponent,
                canActivate: [LoteriaPopularGuard]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoteriasRoutingModule { }

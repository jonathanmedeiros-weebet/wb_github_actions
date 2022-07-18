import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeninhaComponent } from './seninha/seninha.component';
import { QuininhaComponent } from './quininha/quininha.component';
import { QuininhaGuard, SeninhaGuard } from './../services';
import { LoteriaLayoutComponent } from '../shared/layout/app-layouts';

export const routes: Routes = [
    {
        path: '',
        component: LoteriaLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'seninha',
                pathMatch: 'full'
            },
            {
                path: 'seninha',
                component: SeninhaComponent,
                canActivate: [SeninhaGuard]
            },
            {
                path: 'quininha',
                component: QuininhaComponent,
                canActivate: [QuininhaGuard]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoteriasRoutingModule { }

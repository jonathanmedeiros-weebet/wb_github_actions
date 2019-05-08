import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeninhaComponent } from './seninha/seninha.component';
import { QuininhaComponent } from './quininha/quininha.component';
import { QuininhaGuard, SeninhaGuard } from './../services';

export const routes: Routes = [
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
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoteriasRoutingModule { }

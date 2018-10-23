import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeninhaComponent } from './seninha/seninha.component';
import { QuininhaComponent } from './quininha/quininha.component';

export const routes: Routes = [
    {
        path: 'seninha',
        component: SeninhaComponent
    },
    {
        path: 'quininha',
        component: QuininhaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoteriasRoutingModule { }

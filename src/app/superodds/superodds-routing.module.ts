import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuperoddLayoutComponent } from '../shared/layout/app-layouts/superodd-layout.component';
import { SuperoddsWrapperComponent } from './superodds-wrapper/superodds-wrapper.component';

const routes: Routes = [
    {
        path: '',
        component: SuperoddLayoutComponent,
        children: [
            {
                path: '',
                component: SuperoddsWrapperComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SuperoddsRoutingModule {
}

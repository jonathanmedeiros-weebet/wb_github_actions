import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SportLayoutComponent } from 'src/app/shared/layout/app-layouts';
import { LiveWrapperComponent } from './wrapper/live-wrapper.component';

export const routes: Routes = [
    {
        path: '',
        component: SportLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: '/live/futebol',
                pathMatch: 'full'
            },
            {
                path: ':esporte',
                component: LiveWrapperComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LiveRoutingModule { }

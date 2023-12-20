import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {LiveSportLayoutComponent, SportLayoutComponent} from 'src/app/shared/layout/app-layouts';
import { LiveWrapperComponent } from './wrapper/live-wrapper.component';

export const routes: Routes = [
    {
        path: '',
        component: LiveSportLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: '/live/all',
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

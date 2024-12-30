import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LastAccessesComponent} from './last-accesses.component';
import {PagesLayoutComponent} from '../shared/layout/app-layouts';

export const routes: Routes = [
    {
        path: '',
        component: PagesLayoutComponent,
        children: [
            {
                path: '',
                component: LastAccessesComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LastAccessesRoutingModule {
}

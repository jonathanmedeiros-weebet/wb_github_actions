import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {DesafiosWrapperComponent} from './desafios-wrapper/desafios-wrapper.component';
import {DesafioLayoutComponent} from '../shared/layout/app-layouts';

const routes: Routes = [
    {
        path: '',
        component: DesafioLayoutComponent,
        children: [
            {
                path: '',
                component: DesafiosWrapperComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DesafiosRoutingModule {
}

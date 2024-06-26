import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CopiarApostaWrapperComponent } from './wrapper/copiar-aposta-wrapper.component';
import {PagesLayoutComponent} from '../shared/layout/app-layouts';

export const routes: Routes = [
    {
        path: '',
        component: PagesLayoutComponent,
        children: [
            {
                path: '',
                component: CopiarApostaWrapperComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CopiarApostaRoutingModule { }

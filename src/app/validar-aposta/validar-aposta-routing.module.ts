import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValidarApostaWrapperComponent } from './wrapper/validar-aposta-wrapper.component';
import {PagesLayoutComponent} from '../shared/layout/app-layouts';

export const routes: Routes = [
    {
        path: '',
        component: PagesLayoutComponent,
        children: [
            {
                path: '',
                component: ValidarApostaWrapperComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ValidarApostaRoutingModule { }

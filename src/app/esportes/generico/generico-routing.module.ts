import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenericoWrapperComponent } from './wrapper/generico-wrapper.component';

export const routes: Routes = [
    {
        path: '',
        component: GenericoWrapperComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GenericoRoutingModule { }

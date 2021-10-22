import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreEventoWrapperComponent } from './wrapper/pre-evento-wrapper.component';

export const routes: Routes = [
    {
        path: '',
        component: PreEventoWrapperComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PreEventoRoutingModule { }

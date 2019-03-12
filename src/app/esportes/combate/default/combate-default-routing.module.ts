import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CombateDefaultWrapperComponent } from './wrapper/combate-default-wrapper.component';

export const routes: Routes = [
    {
        path: '',
        component: CombateDefaultWrapperComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CombateDefaultRoutingModule { }
